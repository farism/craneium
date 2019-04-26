import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../config'
import * as Camera from '../camera'
import { Scene } from 'phaser'

const GROUND_HEIGHT = 70
const GRASS_HEIGHT = GROUND_HEIGHT + 30
const OCEAN_HEIGHT = GRASS_HEIGHT + 40
const SKY_HEIGHT = WINDOW_HEIGHT * 100
const GROUND_COLOR = '#966014'
const GRASS_COLOR = '#3e9b00'
const OCEAN_COLOR = '#034096'
const SKY_COLOR = '#27b5fe'
const CRANE_BOTTOM_X = 156
const CRANE_BODY_TILE_Y = WINDOW_HEIGHT - GROUND_HEIGHT
const CRANE_BODY_TOP_WIDTH = 106
const CRANE_BODY_TOP_INITIAL_Y = 150
const CRANE_ARM_TILE_X = 500
const CRANE_ARM_TILE_WIDTH = 320
const CRANE_CHAIN_LINK_COUNT = 15
const CRANE_CHAIN_LINK_HEIGHT = 50
const CRANE_CHAIN_LINK_WIDTH = 20
const CRANE_CHAIN_LINK_OFFSET = 0.3
const CRANE_CHAIN_STIFFNESS = 0.5
const CRANE_CHAIN_ANGULAR_STIFFNESS = 0.5
const CRANE_CHAIN_DAMPING = 1
const CRANE_COLLISION_GROUP = 3
const PILE_COLLISION_GROUP = 2

interface Crane {
  armChainAnchor: Phaser.GameObjects.Image
  armChain: MatterJS.Composite
  armMover: Phaser.GameObjects.Image
  armEnd: Phaser.GameObjects.Image
  armTile: Phaser.GameObjects.TileSprite
  bodyBottom: Phaser.GameObjects.Image
  bodyTile: Phaser.GameObjects.TileSprite
  bodyTop: Phaser.GameObjects.Image
}

const addChainAnchor = (scene: MainScene, group: number) => {
  const obj = scene.matter.add.image(300, 120, '')
  obj.setIgnoreGravity(true)
  obj.setCollisionGroup(group)
  obj.setFixedRotation()
  obj.setMass(1000000)

  return obj
}

const addChain = (scene: MainScene, armChainAnchor: any, group: number) => {
  const yOffset = CRANE_CHAIN_LINK_HEIGHT * CRANE_CHAIN_LINK_OFFSET

  const obj = scene.matter.add.stack(
    armChainAnchor.x - 10,
    armChainAnchor.y - yOffset - 5,
    1,
    CRANE_CHAIN_LINK_COUNT,
    0,
    -yOffset,
    function(x, y) {
      return (Phaser.Physics.Matter as any).Matter.Bodies.rectangle(
        x,
        y,
        CRANE_CHAIN_LINK_WIDTH,
        CRANE_CHAIN_LINK_HEIGHT,
        {
          collisionFilter: {
            group: group,
          },
          chamfer: 5,
          density: 0.1,
          frictionAir: 0.01,
        }
      )
    }
  )

  const chain: any = scene.matter.add.chain(
    obj,
    0,
    CRANE_CHAIN_LINK_OFFSET,
    0,
    -CRANE_CHAIN_LINK_OFFSET,
    {
      stiffness: CRANE_CHAIN_STIFFNESS,
      angularStiffness: CRANE_CHAIN_ANGULAR_STIFFNESS,
      damping: CRANE_CHAIN_DAMPING,
      length: 0,
      render: { visible: true },
    }
  )

  const chainConstraint: any = scene.matter.add.constraint(
    chain.bodies[0],
    armChainAnchor,
    0
  )

  chainConstraint.pointA.y = -20

  return chain
}

const addBeamPiece = (scene: MainScene) => {
  const obj = scene.matter.add.image(400, 500, 'piece-beam')

  obj.setFixedRotation()
  obj.setScale(2)
  scene.addTopile(obj)

  return obj
}

const addBlockPiece = (scene: MainScene) => {
  const obj = scene.matter.add.image(400, 500, 'piece-block')

  obj.setScale(2)
  obj.setFixedRotation()
  scene.addTopile(obj)

  return obj
}

const addLPiece = (scene: MainScene) => {
  const obj = scene.matter.add.image(400, 500, 'piece-l')

  obj.setFixedRotation()
  obj.setScale(2)
  scene.addTopile(obj)

  return obj
}

const addTerrain = (height: number, color: string, scene: MainScene) => {
  return scene.add.rectangle(
    WINDOW_WIDTH / 2,
    WINDOW_HEIGHT - height / 2,
    WINDOW_WIDTH,
    height,
    Phaser.Display.Color.HexStringToColor(color).color
  )
}

const addGround = (scene: MainScene) => {
  addTerrain(GROUND_HEIGHT, GROUND_COLOR, scene)

  scene.matter.add.rectangle(
    WINDOW_WIDTH / 2,
    WINDOW_HEIGHT - GROUND_HEIGHT / 2,
    WINDOW_WIDTH,
    GROUND_HEIGHT,
    {
      isStatic: true,
    }
  )
}

const getHighestPiece = (
  container: Phaser.GameObjects.Container
): Phaser.GameObjects.Image | undefined => {
  let piece: any = null

  container.getAll().forEach(obj => {
    const img = obj as Phaser.GameObjects.Image

    if (!piece || img.y > piece.y) {
      piece = img
    }
  })

  return piece as Phaser.GameObjects.Image
}

const addPile = (scene: MainScene) => {
  return scene.add.container(0, 0)
}

const addCrane = (scene: MainScene): Crane => {
  const group = scene.matter.world.nextGroup(true)
  const bodyTile = scene.add
    .tileSprite(CRANE_BOTTOM_X, CRANE_BODY_TILE_Y, 32, 10000, 'crane-body-tile')
    .setOrigin(0.5, 1)
    .setScale(2)

  const bodyBottom = scene.add
    .image(
      CRANE_BOTTOM_X,
      WINDOW_HEIGHT - GROUND_HEIGHT + 10,
      'crane-body-bottom'
    )
    .setScale(2)

  const armTile = scene.add
    .tileSprite(CRANE_ARM_TILE_X, 0, CRANE_ARM_TILE_WIDTH, 32, 'crane-arm-tile')
    .setScale(2)

  const bodyTop = scene.add
    .image(CRANE_BODY_TOP_WIDTH, CRANE_BODY_TOP_INITIAL_Y, 'crane-body-top')
    .setScale(2)

  bodyTop.setX(bodyTop.width)

  const armEnd = scene.add.image(860, 0, 'crane-arm-end').setScale(2)

  const armMover = scene.add.image(300, 0, 'crane-arm-mover').setScale(2)

  const armChainAnchor = addChainAnchor(scene, group)

  const armChain = addChain(scene, armChainAnchor, group)

  return {
    bodyTile,
    bodyBottom,
    bodyTop,
    armMover,
    armEnd,
    armTile,
    armChain,
    armChainAnchor,
  }
}

const addProcoreP2 = (scene: MainScene) => {
  scene.add
    .image(0, WINDOW_HEIGHT - GRASS_HEIGHT + 20, 'procore-p2')
    .setScale(2)
    .setOrigin(0, 1)
}

const updateCranePosition = (scene: MainScene) => {
  if (!scene.crane) {
    return
  }

  scene.crane.armTile.setY(scene.crane.bodyTop.y - 30)

  scene.crane.armMover.setY(scene.crane.armTile.y)

  scene.crane.armEnd.setY(scene.crane.armTile.y)

  scene.crane.armChainAnchor.setPosition(
    scene.crane.armMover.x,
    scene.crane.armMover.y
  )

  // scene.crane.armChainAnchor.setY(scene.crane.armTile.y)
}

export class MainScene extends Phaser.Scene {
  pile?: Phaser.GameObjects.Container
  crane?: Crane
  currentPiece?: Phaser.GameObjects.Image
  keys: any

  constructor() {
    super({
      key: 'MainScene',
    })
  }

  preload = () => {
    this.load.image('button-play', './src/assets/button-play.png')
    this.load.image('cloud-1', './src/assets/cloud-1.png')
    this.load.image('cloud-2', './src/assets/cloud-2.png')
    this.load.image('crane-arm-end', './src/assets/crane-arm-end.png')
    this.load.image('crane-arm-mover', './src/assets/crane-arm-mover.png')
    this.load.image('crane-arm-tile', './src/assets/crane-arm-tile3.png')
    this.load.image('crane-body-bottom', './src/assets/crane-body-bottom.png')
    this.load.image('crane-body-tile', './src/assets/crane-body-tile3.png')
    this.load.image('crane-body-top', './src/assets/crane-body-top.png')
    this.load.image('craneium-logo', './src/assets/craneium-logo.png')
    this.load.image('piece-beam', './src/assets/piece-beam.png')
    this.load.image('person-faris', './src/assets/person-faris.png')
    this.load.image('person-kevin', './src/assets/person-kevin.png')
    this.load.image('person-remy', './src/assets/person-remy.png')
    this.load.image('piece-block', './src/assets/piece-block.png')
    this.load.image('piece-l', './src/assets/piece-l.png')
    this.load.image('procore-p2', './src/assets/procore-p2.png')
  }

  create = () => {
    const { centerX, centerY } = this.cameras.main
    // this.cameras.main.centerOnX(centerX)
    // this.cameras.main.centerOnY(-centerY)
    // this.cameraMode = Camera.CameraModeNS.follow

    // INPUTS
    this.keys = this.input.keyboard.addKeys('W,S,A,D,up,down,left,right,space')

    addTerrain(SKY_HEIGHT, SKY_COLOR, this)
    addTerrain(OCEAN_HEIGHT, OCEAN_COLOR, this)
    addTerrain(GRASS_HEIGHT, GRASS_COLOR, this)
    addGround(this)
    addProcoreP2(this)
    this.pile = addPile(this)
    this.crane = addCrane(this)

    this.currentPiece = addBlockPiece(this)
    // addBeamPiece(this)
    // addLPiece(this)
  }

  update = () => {
    // Camera.updateCamera({
    //   canvas: this.sys.game.canvas,
    //   mode: this.cameraMode,
    //   camera: this.cameras.main,
    //   target: this.crate,
    // })

    if (this.crane) {
      if (this.keys.W.isDown || this.keys.S.isDown) {
        const y = this.crane.bodyTop.y

        if (this.keys.W.isDown) {
          this.crane.bodyTop.setY(y - 5)
        } else if (this.keys.S.isDown) {
          this.crane.bodyTop.setY(Math.min(CRANE_BODY_TOP_INITIAL_Y, y + 5))
        }
      }

      if (this.keys.left.isDown || this.keys.right.isDown) {
        const x = this.crane.armMover.x

        if (this.keys.left.isDown) {
          this.crane.armMover.setX(Math.max(300, x - 5))
        } else if (this.keys.right.isDown) {
          this.crane.armMover.setX(Math.min(800, x + 5))
        }
      }
    }

    // if (this.keys.space.isDown) {
    //   if (this.crate && this.hook) {
    //     if (!this.isHolding) {
    //       this.hookConstraint = this.matter.add.constraint(
    //         this.crate,
    //         this.hook,
    //         0
    //       )
    //       console.log(this.hookConstraint)
    //       debugger
    //     }
    //     this.isHolding = true
    //   }
    // } else {
    //   if (this.isHolding && this.hookConstraint) {
    //     this.matter.world.removeConstraint(this.hookConstraint, true)
    //     debugger
    //   }
    //   this.isHolding = false
    // }

    this.crane && updateCranePosition(this)
  }

  addTopile = (gameObject: Phaser.GameObjects.GameObject) => {
    this.pile && this.pile.add(gameObject)
  }
}

import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../config'
import * as Camera from '../camera'

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

interface Crane {
  armMover: Phaser.GameObjects.Image
  armEnd: Phaser.GameObjects.Image
  armTile: Phaser.GameObjects.TileSprite
  bodyBottom: Phaser.GameObjects.Image
  bodyTile: Phaser.GameObjects.TileSprite
  bodyTop: Phaser.GameObjects.Image
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
  const bodyTile = scene.add
    .tileSprite(CRANE_BOTTOM_X, CRANE_BODY_TILE_Y, 32, 10000, 'crane-body-tile')
    .setOrigin(0.5, 1)
    .setScale(2)

  const bodyBottom = scene.add
    .image(CRANE_BOTTOM_X, WINDOW_HEIGHT - GROUND_HEIGHT, 'crane-body-bottom')
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

  return {
    bodyTile,
    bodyBottom,
    bodyTop,
    armMover,
    armEnd,
    armTile,
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
}

export class MainScene extends Phaser.Scene {
  pile?: Phaser.GameObjects.Container
  crane?: Crane
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

    addBeamPiece(this)
    addBlockPiece(this)
    addLPiece(this)
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

    this.crane && updateCranePosition(this)
  }

  addTopile = (gameObject: Phaser.GameObjects.GameObject) => {
    this.pile && this.pile.add(gameObject)
  }
}

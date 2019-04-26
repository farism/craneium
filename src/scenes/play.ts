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
const CRANE_LEFT_OFFSET = 170

interface Crane {
  armMover: Phaser.GameObjects.Image
  armEnd: Phaser.GameObjects.Image
  armTile: Phaser.GameObjects.TileSprite
  bodyBottom: Phaser.GameObjects.Image
  bodyTile: Phaser.GameObjects.TileSprite
  bodyTop: Phaser.GameObjects.Image
}

const addBeamPiece = (scene: Phaser.Scene, x: number = 0, y: number = 0) => {
  const obj = scene.matter.add.image(x, y, 'piece-beam')

  obj.setFixedRotation()
  obj.setScale(3)

  return obj
}

const addBlockPiece = (scene: Phaser.Scene, x: number = 0, y: number = 0) => {
  const obj = scene.matter.add.image(x, y, 'piece-block')

  obj.setScale(3)
  obj.setFixedRotation()

  return obj
}

const addLPiece = (scene: Phaser.Scene, x: number = 0, y: number = 0) => {
  const obj = scene.matter.add.image(x, y, 'piece-l')

  obj.setFixedRotation()
  obj.setScale(3)

  return obj
}

const addTerrain = (height: number, color: string, scene: Phaser.Scene) => {
  return scene.add.rectangle(
    WINDOW_WIDTH / 2,
    WINDOW_HEIGHT - height / 2,
    WINDOW_WIDTH,
    height,
    Phaser.Display.Color.HexStringToColor(color).color
  )
}

const addGround = (scene: Phaser.Scene) => {
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

const addCrane = (scene: Phaser.Scene): Crane => {
  return {
    armMover: scene.add.image(0, 0, 'crane-arm-mover').setScale(2),
    armEnd: scene.add.image(0, 0, 'crane-arm-end').setScale(2),
    armTile: scene.add.tileSprite(0, 0, 62, 19, 'crane-arm-tile').setScale(2),
    bodyBottom: scene.add.image(0, 0, 'crane-body-bottom').setScale(2),
    bodyTile: scene.add.tileSprite(0, 0, 30, 25, 'crane-body-tile').setScale(2),
    bodyTop: scene.add.image(0, 0, 'crane-body-top').setScale(2),
  }
}

const addProcoreP2 = (scene: Phaser.Scene) => {
  scene.add
    .image(0, WINDOW_HEIGHT - GRASS_HEIGHT + 20, 'procore-p2')
    .setScale(2)
    .setOrigin(0, 1)
}

const updateCranePosition = (crane: Crane) => {
  crane.bodyBottom.setPosition(CRANE_LEFT_OFFSET, WINDOW_HEIGHT - GROUND_HEIGHT)
}

export class MainScene extends Phaser.Scene {
  keys: any
  crane?: Crane

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
    this.load.image('crane-arm-tile', './src/assets/crane-arm-tile.png')
    this.load.image('crane-body-bottom', './src/assets/crane-body-bottom.png')
    this.load.image('crane-body-tile', './src/assets/crane-body-tile.png')
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
    // addBeamPiece(this)
    // addBlockPiece(this)
    // addLPiece(this)
    addProcoreP2(this)
    this.crane = addCrane(this)
  }

  update = () => {
    this.crane && updateCranePosition(this.crane)
    // Camera.updateCamera({
    //   canvas: this.sys.game.canvas,
    //   mode: this.cameraMode,
    //   camera: this.cameras.main,
    //   target: this.crate,
    // })
    // if (!this.armAnchor) {
    //   return
    // }
    // if (this.keys.left.isDown || this.keys.right.isDown) {
    //   if (this.keys.left.isDown) {
    //     this.armAnchor.setVelocityX(-5)
    //   }
    //   if (this.keys.right.isDown) {
    //     this.armAnchor.setVelocityX(5)
    //   }
    // } else {
    //   this.armAnchor.setVelocityX(0)
    // }
    // if (this.keys.up.isDown || this.keys.down.isDown) {
    //   if (this.keys.up.isDown) {
    //     this.armAnchor.setVelocityY(-5)
    //   }
    //   if (this.keys.down.isDown) {
    //     this.armAnchor.setVelocityY(5)
    //   }
    // } else {
    //   this.armAnchor.setVelocityY(0)
    // }
  }
}

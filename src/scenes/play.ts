import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../config'
import * as Camera from '../camera'

const createGround = (scene: Phaser.Scene) => {
  const obj = scene.matter.add.image(0, WINDOW_HEIGHT - 20, 'concrete')

  obj.setPosition(WINDOW_WIDTH / 2, 0)
  obj.setStatic(true)
  obj.setSize(1024, 20)

  return obj
}

const createCrate = (scene: Phaser.Scene) => {
  const obj = scene.matter.add.image(0, 0, 'crate')

  obj.setPosition(WINDOW_WIDTH / 2, -225)
  obj.setSize(225, 225)
  obj.setScale(0.5)

  return obj
}

const createArm = (scene: Phaser.Scene) => {
  const obj = scene.matter.add.image(0, 0, 'arm')

  obj.setPosition(WINDOW_WIDTH / 2, -300)
  obj.setSize(600, 442)
  obj.setScale(1, 0.5)
  obj.setIgnoreGravity(true)
  obj.setMass(1000)

  return obj
}
const createLink = (y: number, scene: Phaser.Scene) => {
  const obj = scene.matter.add.image(0, y, 'chain', undefined, {
    shape: 'rectangle',
    mass: 0.1,
  })

  obj.setScale(0.05, 0.05)

  return obj
}

const createChain = (arm: Phaser.Physics.Matter.Image, scene: Phaser.Scene) => {
  let y = 0
  let prev = arm

  for (var i = 0; i < 5; i++) {
    const link = createLink(y, scene)
    scene.matter.add.joint(prev, link, i === 0 ? 200 : 35, 0.4)
    prev = link
    y += 400
  }

  return
}

export class MainScene extends Phaser.Scene {
  keys: any
  ground?: Phaser.Physics.Matter.Image
  crate?: Phaser.Physics.Matter.Image
  arm?: Phaser.Physics.Matter.Image
  cameraMode?: Camera.CameraMode

  constructor() {
    super({
      key: 'MainScene',
    })
  }

  preload = () => {
    this.load.image('arm', './src/assets/arm.png')
    this.load.image('chain', './src/assets/chain.png')
    this.load.image('concrete', './src/assets/concrete.jpg')
    this.load.image('crate', './src/assets/crate.png')
  }

  create = () => {
    // CAMERA
    debugger
    const { centerX, centerY } = this.cameras.main
    this.cameras.main.centerOnX(centerX)
    this.cameras.main.centerOnY(-centerY)
    this.cameraMode = Camera.CameraModeNS.follow

    // INPUTS
    this.keys = this.input.keyboard.addKeys('W,S,A,D,up,down,left,right,space')

    // OBJECTS
    this.ground = createGround(this)
    this.crate = createCrate(this)
    this.arm = createArm(this)
    createChain(this.arm, this)
  }

  update = () => {
    Camera.updateCamera({
      canvas: this.sys.game.canvas,
      mode: this.cameraMode,
      camera: this.cameras.main,
      target: this.crate,
    })

    if (!this.arm) {
      return
    }

    if (this.keys.left.isDown || this.keys.right.isDown) {
      if (this.keys.left.isDown) {
        this.arm.setVelocityX(-5)
      }
      if (this.keys.right.isDown) {
        this.arm.setVelocityX(5)
      }
    } else {
      this.arm.setVelocityX(0)
    }

    if (this.keys.up.isDown || this.keys.down.isDown) {
      if (this.keys.up.isDown) {
        this.arm.setVelocityY(-5)
      }
      if (this.keys.down.isDown) {
        this.arm.setVelocityY(5)
      }
    } else {
      this.arm.setVelocityY(0)
    }
  }
}

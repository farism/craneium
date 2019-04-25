import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../config'

const createGround = (scene: Phaser.Scene) => {
  const obj = scene.matter.add.image(0, WINDOW_HEIGHT - 20, 'concrete')

  obj.setPosition(WINDOW_WIDTH / 2, WINDOW_HEIGHT)
  obj.setStatic(true)
  obj.setSize(1024, 20)

  return obj
}

const createCrate = (scene: Phaser.Scene) => {
  const obj = scene.matter.add.image(0, 0, 'crate')

  obj.setPosition(WINDOW_WIDTH / 2, WINDOW_HEIGHT - 225)
  obj.setSize(225, 225)
  obj.setScale(0.5)

  return obj
}

const createArm = (scene: Phaser.Scene) => {
  const obj = scene.matter.add.image(0, 0, 'arm')

  obj.setPosition(WINDOW_WIDTH / 2, 110)
  obj.setSize(600, 442)
  obj.setScale(1, 0.5)
  obj.setStatic(true)

  return obj
}
const createLink = (y: number, scene: Phaser.Scene) => {
  const obj = scene.matter.add.image(0, y, 'chain', undefined, {
    shape: 'rectangle',
    mass: 1,
  })

  obj.setScale(0.05, 0.05)

  return obj
}

const createChain = (arm: Phaser.Physics.Matter.Image, scene: Phaser.Scene) => {
  let y = 0
  let prev = arm

  for (var i = 0; i < 12; i++) {
    const link = createLink(y, scene)
    scene.matter.add.joint(prev, link, i === 0 ? 90 : 35, 0.4)
    prev = link
    y += 18
  }

  return
}

export class MainScene extends Phaser.Scene {
  keys: any
  ground?: Phaser.Physics.Matter.Image
  crate?: Phaser.Physics.Matter.Image
  arm?: Phaser.Physics.Matter.Image

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
    this.keys = this.input.keyboard.addKeys('W,S,A,D,up,down,left,right,space')

    this.ground = createGround(this)
    this.crate = createCrate(this)
    this.arm = createArm(this)

    createChain(this.arm, this)
  }

  update = () => {
    if (this.keys.left.isDown) {
      this.arm && this.arm.setVelocityX(-50)
    } else if (this.keys.right.isDown) {
      this.arm && this.arm.setVelocityX(50)
    }
  }
}

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

const createArmAnchor = (scene: Phaser.Scene) => {
  const obj = scene.matter.add.image(0, 0, 'ball')

  obj.setPosition(WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2)
  obj.setSize(1300, 1300)
  obj.setScale(0.01, 0.01)
  obj.setMass(1000)
  obj.setFixedRotation()
  obj.setIgnoreGravity(true)

  return obj
}

const createChain = (arm: Phaser.Physics.Matter.Image, scene: Phaser.Scene) => {
  var group = scene.matter.world.nextGroup(true)

  var obj = scene.matter.add.stack(arm.x, arm.y, 1, 5, 0, 0, function(x, y) {
    return (Phaser.Physics.Matter as any).Matter.Bodies.rectangle(
      x,
      y,
      20,
      50,
      {
        collisionFilter: { group: group },
        chamfer: 5,
        density: 0.1,
        mass: 0,
        frictionAir: 0.01,
      }
    )
  })

  scene.matter.add.chain(obj, 0, 0.5, 0, -0.3, {
    stiffness: 1,
    length: 0,
    render: {
      visible: true,
    },
  })

  const constraint: any = scene.matter.add.constraint(
    (obj as any).bodies[0],
    arm,
    50
  )

  // constraint.bodyA.pivot.y = -10

  return obj
}

export class MainScene extends Phaser.Scene {
  keys: any
  ground?: Phaser.Physics.Matter.Image
  crate?: Phaser.Physics.Matter.Image
  arm?: Phaser.Physics.Matter.Image
  armAnchor?: Phaser.Physics.Matter.Image
  cameraMode?: Camera.CameraMode

  constructor() {
    super({
      key: 'MainScene',
    })
  }

  preload = () => {
    this.load.image('arm', './src/assets/arm.png')
    this.load.image('ball', './src/assets/ball.jpg')
    this.load.image('chain', './src/assets/chain.png')
    this.load.image('concrete', './src/assets/concrete.jpg')
    this.load.image('crate', './src/assets/crate.png')
  }

  create = () => {
    const { centerX, centerY } = this.cameras.main
    // this.cameras.main.centerOnX(centerX)
    // this.cameras.main.centerOnY(-centerY)
    // this.cameraMode = Camera.CameraModeNS.follow

    // INPUTS
    this.keys = this.input.keyboard.addKeys('W,S,A,D,up,down,left,right,space')

    // OBJECTS
    // this.ground = createGround(this)
    // this.crate = createCrate(this)
    // this.arm = createArm(this)
    this.armAnchor = createArmAnchor(this)
    createChain(this.armAnchor, this)
  }

  update = () => {
    // Camera.updateCamera({
    //   canvas: this.sys.game.canvas,
    //   mode: this.cameraMode,
    //   camera: this.cameras.main,
    //   target: this.crate,
    // })

    if (!this.armAnchor) {
      return
    }

    if (this.keys.left.isDown || this.keys.right.isDown) {
      if (this.keys.left.isDown) {
        this.armAnchor.setVelocityX(-5)
      }
      if (this.keys.right.isDown) {
        this.armAnchor.setVelocityX(5)
      }
    } else {
      this.armAnchor.setVelocityX(0)
    }

    if (this.keys.up.isDown || this.keys.down.isDown) {
      if (this.keys.up.isDown) {
        this.armAnchor.setVelocityY(-5)
      }
      if (this.keys.down.isDown) {
        this.armAnchor.setVelocityY(5)
      }
    } else {
      this.armAnchor.setVelocityY(0)
    }
  }
}

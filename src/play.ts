import { createBackground, groundHeight, skyHeight } from './background'
import { windowHeight, windowWidth } from './viewport'

const gameStartStack = 50
const craneBottomX = 156
const craneBodyTileY = windowHeight - groundHeight
const craneBodyTopWidth = 106
const craneBodyTopInitialY = 150
const craneArmTileX = 500
const craneArmTileWidth = 320
const craneChainLinkCount = 5
const craneChainLinkHeight = 50
const craneChainLinkWidth = 20
const craneChainLinkOffset = 0.3
const craneChainStiffness = 0.5
const craneChainAngularStiffness = 0.8
const craneChainDamping = 1

interface Crane {
  anchor: Phaser.GameObjects.Image
  arm: Phaser.GameObjects.TileSprite
  base: Phaser.GameObjects.Image
  body: Phaser.GameObjects.TileSprite
  cap: Phaser.GameObjects.Image
  capsule: Phaser.GameObjects.Image
  chain?: MatterJS.Composite
  hook: Phaser.GameObjects.Image
  slider: Phaser.GameObjects.Image
}

export class PlayScene extends Phaser.Scene {
  currentScore?: {
    graphics: Phaser.GameObjects.Graphics
    line: Phaser.Geom.Line
  }
  pile?: Phaser.GameObjects.Container
  crane?: Crane
  currentPiece?: Phaser.GameObjects.Image
  isHooked: boolean = false
  isHookedConstraint: any
  keys: any
  score: any
  group: number
  pileGroup: number
  category: number
  remainingPieces: number

  constructor() {
    super({
      key: 'PlayScene',
    })
    this.group = 0
    this.pileGroup = 0
    this.category = 0
    this.remainingPieces = gameStartStack
  }

  get isMovingUp(): boolean {
    return this.keys.W.isDown || this.keys.up.isDown
  }

  get isMovingDown(): boolean {
    return this.keys.S.isDown || this.keys.down.isDown
  }

  get isMovingLeft(): boolean {
    return this.keys.A.isDown || this.keys.left.isDown
  }

  get isMovingRight(): boolean {
    return this.keys.D.isDown || this.keys.right.isDown
  }

  createLine = (x: number, y: number, color: string) => {
    return {
      graphics: this.add.graphics({
        lineStyle: {
          width: 2,
          color: Phaser.Display.Color.HexStringToColor(color).color,
        },
      }),
      line: new Phaser.Geom.Line(x, y, windowWidth, y),
    }
  }

  createChainAnchor = () => {
    const obj = this.matter.add.image(300, 120, 'transparent')
    obj.setIgnoreGravity(true)
    // obj.setCollisionGroup(-1)
    obj.setFixedRotation()
    obj.setMass(10)

    return obj
  }

  createChainHook = (x: number, y: number) => {
    const obj = this.matter.add.image(x, y, 'crane-hook')
    // obj.setCollisionGroup(-1)
    // obj.setFixedRotation()
    // obj.setMass(2)

    return obj
  }

  createChain = (x: number, y: number) => {
    const obj = this.matter.add.imageStack(
      'crane-chain',
      0,
      x - 10,
      y,
      1,
      10,
      0,
      1,
      {
        density: 0.01,
        friction: 1,
      }
    )

    // const chain: any = this.matter.add.chain(obj, 0, 0.3, 0, -0.3, {
    //   stiffness: 0.8,
    //   // angularStiffness: 0.1,
    //   damping: 0.1,
    //   render: {
    //     visible: true,
    //   },
    // })
  }

  createCrane = () => {
    const body = this.add
      .tileSprite(craneBottomX, craneBodyTileY, 32, skyHeight, 'crane-body')
      .setOrigin(0.5, 1)
      .setScale(2)

    const base = this.add
      .image(craneBottomX, windowHeight - groundHeight + 10, 'crane-base')
      .setScale(2)

    const arm = this.add
      .tileSprite(craneArmTileX, 0, craneArmTileWidth, 32, 'crane-arm')
      .setScale(2)

    const capsule = this.add
      .image(craneBodyTopWidth, craneBodyTopInitialY, 'crane-capsule')
      .setScale(2)

    // const cap = this.add.image(860, 0, 'crane-cap').setScale(2)

    const slider = this.add.image(300, 0, 'crane-slider').setScale(2)

    const anchor = this.createChainAnchor()

    const chain = this.createChain(anchor.x, anchor.y)

    const chainHead = (chain as any).bodies[0]

    const chainTail = (chain as any).bodies[craneChainLinkCount - 1]

    const hook = this.createChainHook(0, 0)

    this.matter.add.constraint(chainHead, anchor as any, 0.01, 1, {
      pointA: { x: 0, y: 0 },
      pointB: { x: 0, y: 20 },
      render: { visible: true, lineColor: 0xff0000 },
      damping: 0.1,
    })

    // this.matter.add.constraint(chainTail, hook as any, 0, 0.8, {
    //   pointA: { x: 0, y: 0 },
    //   pointB: { x: 0, y: 40 },
    // })

    this.crane = {
      body,
      base,
      capsule,
      slider,
      cap,
      arm,
      // chain,
      anchor,
      hook,
    }
  }

  createPile = () => {
    this.pile = this.add.container(0, 0)
  }

  addToPile = (gameObject: Phaser.GameObjects.GameObject) => {
    this.pile && this.pile.add(gameObject)
  }

  createRandomPiece = () => {
    const pieces = [
      this.createBeamPiece,
      this.createBrickPiece,
      this.createWoodPiece,
    ]
    const index = Math.floor(Math.random() * pieces.length)
    const piece = pieces[index]()
    piece.setFriction(1, 0, 10)
    // piece.body.damping = 1

    this.addToPile(piece)

    console.log('here')

    return piece
  }

  createBeamPiece = () => {
    const piece = this.matter.add.image(400, 500, 'piece-beam')

    piece.setFixedRotation()
    piece.setScale(2)
    piece.setCollisionGroup(this.group)
    piece.setCollisionCategory(this.category)
    piece.setCollidesWith([this.category])

    return piece
  }

  createBrickPiece = () => {
    const piece = this.matter.add.image(400, 500, 'piece-brick')

    piece.setScale(2)
    piece.setFixedRotation()
    piece.setCollisionGroup(this.group)
    piece.setCollisionCategory(this.category)
    piece.setCollidesWith([this.category])
    piece.setMass(100)

    return piece
  }

  createWoodPiece = () => {
    const piece = this.matter.add.image(400, 500, 'piece-wood')

    piece.setScale(2)
    piece.setFixedRotation()
    piece.setCollisionGroup(this.group)
    piece.setCollisionCategory(this.category)
    piece.setCollidesWith([this.category])
    piece.setMass(100)

    return piece
  }

  updateCurrent = () => {
    if (!this.crane || this.isHooked) return

    const pile = ((this.pile && this.pile.getAll()) || []).map(
      (piece) => piece.body
    )

    const Query = (Phaser.Physics.Matter as any).Matter.Query
    const collisions = Query.collides(this.crane.hook.body, pile)
    if (collisions.length) {
      // TODO find closest
      const closest = collisions[0]
      const current =
        closest.bodyA.gameObject === this.crane.hook
          ? closest.bodyB.gameObject
          : closest.bodyA.gameObject
      this.currentPiece = current
    }
  }

  updateScore = () => {
    const highest = (this.pile && this.getHighestPiece(this.pile)) || {
      y: 0,
      height: 0,
    }

    const text = `${Math.floor(
      (windowHeight - (highest.y + highest.height / 2) - 51) / 10
    )}m`

    this.score =
      this.score ||
      this.add.text(0, windowHeight - groundHeight / 4 - 100, text)

    this.score.setY(this.cameras.main.scrollY + 20)
    this.score.setX(windowWidth - 60)
    // console.log({ highest: WINDOW_HEIGHT - highest.y })
  }

  getHighestPiece = (
    container: Phaser.GameObjects.Container
  ): Phaser.GameObjects.Image | undefined => {
    const [first, ...pile]: any[] = container.getAll()

    return first
      ? pile.reduce((highest, next) => {
          return highest.y < next.y ? highest : next
        }, first)
      : undefined
  }

  updateCranePosition = () => {
    if (!this.crane) {
      return
    }

    this.crane.arm.setY(this.crane.capsule.y - 30)

    this.crane.slider.setY(this.crane.arm.y)

    this.crane.cap.setY(this.crane.arm.y)

    this.crane.anchor.setPosition(this.crane.slider.x, this.crane.slider.y)
  }

  isHookTouchingCurrentPiece = () => {
    return (
      this.currentPiece &&
      this.crane &&
      (Phaser.Physics.Matter as any).Matter.SAT.collides(
        this.currentPiece.body,
        this.crane.hook.body
      ).collided
    )
  }

  preload = () => {
    this.load.image('button-play', './src/assets/button-play.png')
    this.load.image('cloud-1', './src/assets/cloud-1.png')
    this.load.image('cloud-2', './src/assets/cloud-2.png')
    this.load.image('crane-arm', './src/assets/crane-arm.png')
    this.load.image('crane-base', './src/assets/crane-base.png')
    this.load.image('crane-body', './src/assets/crane-body.png')
    this.load.image('crane-cap', './src/assets/crane-cap.png')
    this.load.image('crane-capsule', './src/assets/crane-capsule.png')
    this.load.image('crane-chain', './src/assets/crane-chain.png')
    this.load.image('crane-hook', './src/assets/crane-hook.png')
    this.load.image('crane-slider', './src/assets/crane-slider.png')
    this.load.image('piece-beam', './src/assets/piece-beam.png')
    this.load.image('piece-brick', './src/assets/piece-brick.png')
    this.load.image('piece-wood', './src/assets/piece-wood.png')
    this.load.image('procore-p2', './src/assets/procore-p2.png')
    this.load.image('transparent', './src/assets/transparent.png')
  }

  create = () => {
    // this.matter.world.setGravity(0, 0.1)
    this.group = this.matter.world.nextGroup(true)

    this.pileGroup = this.matter.world.nextGroup(false)

    this.category = this.matter.world.nextCategory()

    createBackground(this)

    this.createPile()

    this.createCrane()

    this.currentPiece = this.createRandomPiece()

    this.cameras.main.setBounds(
      0,
      -skyHeight,
      windowWidth,
      windowHeight + skyHeight
    )

    if (this.crane?.hook) {
      // this.cameras.main.startFollow(this.crane.hook)
    }

    this.cameras.main.fadeIn(1000, 0, 0, 0)

    // INPUTS
    this.keys = this.input.keyboard.addKeys('W,S,A,D,up,down,left,right,SPACE')

    this.input.keyboard.on('keydown_SPACE', (event) => {
      console.log('here')
      if (event.repeat || !this.crane) {
        return
      }

      if (this.isHooked) {
        if (this.isHooked && this.isHookedConstraint) {
          this.matter.world.removeConstraint(this.isHookedConstraint, true)
        }

        this.isHooked = false
      } else if (this.currentPiece && this.isHookTouchingCurrentPiece()) {
        console.log(typeof this.currentPiece.body)
        if (typeof this.currentPiece.body) {
          // this.isHookedConstraint = this.matter.add.constraint(
          //   this.currentPiece.body,
          //   this.crane.hook,
          //   0
          // )
        }

        this.isHooked = true
      }
    })

    this.input.keyboard.on('keydown_ENTER', (event) => {
      console.log(this)
      if (event.repeat || this.remainingPieces < 1) {
        return
      }
      this.remainingPieces--
      this.createRandomPiece()
    })
  }

  update = () => {
    if (!this.crane) {
      return
    }

    this.updateCurrent()

    this.updateScore()

    if (this.isMovingDown || this.isMovingUp) {
      const y = this.crane.capsule.y

      if (this.isMovingUp) {
        this.crane.capsule.setY(y - 5)
      } else if (this.isMovingDown) {
        this.crane.capsule.setY(Math.min(craneBodyTopInitialY, y + 5))
      }
    }

    if (this.isMovingLeft || this.isMovingRight) {
      const x = this.crane.slider.x

      if (this.isMovingLeft) {
        this.crane.slider.setX(Math.max(300, x - 3))
      } else if (this.isMovingRight) {
        this.crane.slider.setX(Math.min(800, x + 3))
      }
    }

    this.updateCranePosition()
  }
}

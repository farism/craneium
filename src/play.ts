import { createBackground, groundHeight, skyHeight } from './background'
import { randomInRange } from './utils'
import { cameraMaxY, windowHeight, windowWidth } from './viewport'

const totalPieces = 200
const cloudBoundary = 200
const cloudVelocityScale = 50
const craneBottomX = 156
const craneBodyY = windowHeight - groundHeight
const craneArmX = 500
const craneArmY = 175
const craneAnchorY = 116
const craneArmSpeedUp = 2
const craneArmSpeedDown = 3
const craneArmSpeedLeft = 3
const craneArmSpeedRight = 3
const craneArmMinX = 300
const craneArmMaxX = 900
const chainAngularStiffness = 0.8
const chainStiffness = 1

interface Crane {
  anchor: Phaser.Physics.Matter.Image
  arm: Phaser.GameObjects.Image
  base: Phaser.GameObjects.Image
  body: Phaser.GameObjects.TileSprite
  chain: MatterJS.Composite
  hook: Phaser.Physics.Matter.Image
}

export class PlayScene extends Phaser.Scene {
  currentScore?: {
    graphics: Phaser.GameObjects.Graphics
    line: Phaser.Geom.Line
  }
  keys: any
  ground?: MatterJS.BodyType
  pile?: Phaser.GameObjects.Container
  crane?: Crane

  highscoreLine?: Phaser.GameObjects.Rectangle
  highscoreText?: Phaser.GameObjects.Text
  highscore: number = 0

  clouds?: Phaser.GameObjects.Container
  cloudDirections: number[] = []
  cloudPositions: number[] = []

  group: number = 0
  category: number = 0
  hookCategory: number = 0

  remainingPieces: number
  lastCreatedTime: number = 0
  hookedPiece?: Phaser.Physics.Matter.Image | undefined
  hookedPieceAngle: number = 0
  hookedConstraint: MatterJS.ConstraintType | undefined
  hookCollisions: Phaser.Physics.Matter.Image[] = []

  constructor() {
    super({
      key: 'PlayScene',
    })
    this.highscore = this.getHighScore()
    this.remainingPieces = totalPieces
  }

  preload = () => {
    this.load.image('button-play', './src/assets/button-play.png')
    this.load.image('cloud-1', './src/assets/cloud-1.png')
    this.load.image('cloud-2', './src/assets/cloud-2.png')
    this.load.image('cloud-3', './src/assets/cloud-3.png')
    this.load.image('crane-arm', './src/assets/crane-arm.png')
    this.load.image('crane-arm-2', './src/assets/crane-arm-2.png')
    this.load.image('crane-base', './src/assets/crane-base.png')
    this.load.image('crane-body', './src/assets/crane-body.png')
    this.load.image('crane-cap', './src/assets/crane-cap.png')
    this.load.image('crane-capsule', './src/assets/crane-capsule.png')
    this.load.image('crane-chain', './src/assets/crane-chain.png')
    this.load.image('crane-hook', './src/assets/crane-hook.png')
    this.load.image('crane-anchor', './src/assets/crane-anchor.png')
    this.load.image('piece-beam', './src/assets/piece-beam.png')
    this.load.image('piece-brick', './src/assets/piece-brick.png')
    this.load.image('piece-wood', './src/assets/piece-wood.png')
    this.load.image('procore-p2', './src/assets/procore-p2.png')
    this.load.image('transparent', './src/assets/transparent.png')
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

  createCloudDirections = () => {
    this.clouds?.getAll().forEach((obj, i) => {
      const cloud = obj as Phaser.GameObjects.Image

      this.cloudPositions[i] = cloud.x

      if (this.cloudDirections) {
        this.cloudDirections[i] = i % 2 === 0 ? -1 : 1
      }
    })
  }

  createHighscore = () => {
    const alpha = 0.75

    this.highscoreLine = this.add.rectangle(
      windowWidth / 2,
      this.highscore,
      windowWidth,
      2,
      0xffff00,
      alpha
    )

    this.highscoreText = this.add
      .text(0, this.highscore + 10, '', {
        align: 'right',
        color: '#ffff00',
      })
      .setFixedSize(windowWidth - 20, 0)
      .setAlpha(alpha)
  }

  createGround = () => {
    this.ground = this.matter.add.rectangle(
      windowWidth / 2,
      windowHeight - groundHeight / 2,
      windowWidth,
      groundHeight,
      {
        isStatic: true,
        friction: 1,
        collisionFilter: {
          category: this.category,
        },
      }
    )
  }

  createCrane = () => {
    const createBody = () => {
      const obj = this.add.tileSprite(
        craneBottomX,
        craneBodyY,
        32,
        cameraMaxY,
        'crane-body'
      )
      obj.setOrigin(0.5, 1)
      obj.setScale(2)

      return obj
    }

    const createBase = () => {
      const obj = this.add.image(
        craneBottomX,
        windowHeight - groundHeight + 10,
        'crane-base'
      )
      obj.setScale(2)

      return obj
    }

    const createArm = () => {
      const obj = this.add.image(craneArmX, craneArmY, 'crane-arm-2')
      obj.setScale(2)

      return obj
    }

    const createAnchor = (x: number, y: number) => {
      const obj = this.matter.add.image(x, y, 'crane-anchor')
      obj.setStatic(true)
      obj.setIgnoreGravity(true)
      obj.setCollisionGroup(-1)
      obj.setFixedRotation()
      obj.setScale(2)

      return obj
    }

    const createHook = (x: number, y: number) => {
      const obj = this.matter.add.image(x, y, 'crane-hook')
      obj.setFixedRotation()
      obj.setMass(5)
      obj.setSensor(true)
      obj.setCollisionCategory(this.hookCategory)
      obj.setCollidesWith([this.category])
      obj.setOnCollide(({ bodyB }) => {
        this.hookCollisions = [bodyB.gameObject, ...this.hookCollisions]
      })
      obj.setOnCollideEnd(({ bodyB }) => {
        this.hookCollisions = this.hookCollisions.filter(
          (obj) => bodyB.gameObject !== obj
        )
      })

      return obj
    }

    const createLink = (x: number, y: number) => {
      const obj = this.matter.add.image(x, y, 'crane-chain')
      obj.setCollisionGroup(-1)
      obj.setDensity(0.1)

      return obj
    }

    const createChain = (x: number, y: number) => {
      const chain: Phaser.Physics.Matter.Image[] = []

      let nextY = 0
      let prev: Phaser.Physics.Matter.Image | null = null

      for (let i = 0; i < 11; i++) {
        nextY += 35

        const link = createLink(x, y + nextY)

        if (prev) {
          this.matter.add.constraint(prev as any, link as any, 0, 1.5, {
            angularStiffness: 0.7,
            damping: 0.5,
            pointA: { x: 0, y: 17 },
            pointB: { x: 0, y: -17 },
          })
        }

        prev = link

        chain.push(link)
      }

      return chain
    }

    const attachChainAnchorHook = () => {
      this.matter.add.constraint(
        anchor as any,
        chain[0] as any,
        0,
        chainStiffness,
        {
          angularStiffness: chainAngularStiffness,
          pointA: { x: 0, y: 25 },
          pointB: { x: 0, y: -15 },
        }
      )

      this.matter.add.constraint(
        chain[chain.length - 1] as any,
        hook as any,
        0,
        0.7,
        {
          angularStiffness: 0.6,
          pointA: { x: 0, y: 20 },
        }
      )
    }

    const body = createBody()

    const base = createBase()

    const arm = createArm()

    const anchorY = arm.getTopCenter().y + craneAnchorY

    const chain = createChain(300, anchorY)

    const anchor = createAnchor(300, anchorY)

    const hook = createHook(300, chain[chain.length - 1].y + 20)

    attachChainAnchorHook()

    this.crane = {
      body,
      base,
      anchor,
      arm,
      chain,
      hook,
    }
  }

  createPile = () => {
    this.pile = this.add.container(0, 0)
  }

  initializePiece = (piece: Phaser.Physics.Matter.Image) => {
    piece.setPosition(randomInRange(300, 500), 500)
    piece.setScale(2)
    piece.setCollisionCategory(this.category)
    piece.setCollidesWith([this.category, this.hookCategory])
    piece.setFriction(0.9)

    return piece
  }

  createRandomPiece = () => {
    if (this.remainingPieces < 1) {
      return
    }

    this.remainingPieces--

    const pieces = [
      this.createBeamPiece,
      this.createBrickPiece,
      this.createWoodPiece,
    ]

    const index = Math.floor(Math.random() * pieces.length)

    const piece = pieces[index]()

    piece.addListener('sleep', console.log)

    this.wakePile()

    this.pile?.add(piece)

    return piece
  }

  createBeamPiece = () => {
    const piece = this.matter.add.image(0, 0, 'piece-beam')
    piece.setDensity(0.01)

    return this.initializePiece(piece)
  }

  createBrickPiece = () => {
    const piece = this.matter.add.image(0, 0, 'piece-brick')
    piece.setDensity(0.01)

    return this.initializePiece(piece)
  }

  createWoodPiece = () => {
    const piece = this.matter.add.image(0, 0, 'piece-wood')
    piece.setDensity(0.01)

    return this.initializePiece(piece)
  }

  setupCamera = () => {
    this.cameras.main.setBounds(
      0,
      -cameraMaxY,
      windowWidth,
      windowHeight + cameraMaxY
    )

    if (this.crane?.hook) {
      this.cameras.main.startFollow(this.crane.hook)
    }

    this.cameras.main.fadeIn(1000, 0, 0, 0)
  }

  setupInputs = () => {
    this.keys = this.input.keyboard.addKeys('W,S,A,D,up,down,left,right,SPACE')

    this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
      if (event.code === 'Space' && !event.repeat) {
        this.toggleHookConstraint()
      }

      if (event.code === 'Enter' && !event.repeat) {
        const now = new Date().getTime()
        const canCreate = now - this.lastCreatedTime > 1000

        if (canCreate) {
          this.lastCreatedTime = now
          this.createRandomPiece()
        }
      }
    })
  }

  create = () => {
    const background = createBackground(this, this.category)

    this.clouds = background.clouds

    this.group = this.matter.world.nextGroup(true)

    this.category = this.matter.world.nextCategory()

    this.hookCategory = this.matter.world.nextCategory()

    this.createCloudDirections()

    this.createGround()

    this.createHighscore()

    this.createPile()

    this.createCrane()

    this.setupCamera()

    this.setupInputs()

    this.createRandomPiece()
  }

  wakePile = () => {
    this.pile
      ?.getAll()
      .forEach((obj) => (obj as Phaser.Physics.Matter.Image).setAwake())
  }

  isPileAsleep = () => {
    return this.pile?.getAll().every((obj) => (obj.body as any).isSleeping)
  }

  toggleHookConstraint = () => {
    if (this.hookedConstraint) {
      this.matter.world.removeConstraint(this.hookedConstraint, true)

      this.hookedConstraint = undefined

      this.hookedPiece = undefined
    } else {
      const hook = this.crane?.hook.body as MatterJS.BodyType

      const hovered = this.hookCollisions[0]

      if (hovered) {
        this.hookedPiece = hovered

        this.hookedPieceAngle = hovered.angle ?? 0

        this.hookedConstraint = this.matter.add.constraint(
          hook as MatterJS.BodyType,
          (hovered as unknown) as MatterJS.BodyType,
          0
        )
      }
    }
  }

  updateClouds = () => {
    this.clouds?.getAll().forEach((obj, i) => {
      const cloud = obj as Phaser.GameObjects.Image

      const velocity = cloud.scale / cloudVelocityScale

      const direction = this.cloudDirections?.[i] ?? 1

      this.cloudPositions[i] += velocity * direction

      cloud.x = Math.floor(this.cloudPositions[i])

      // if the cloud has gone off screen, flip it
      if (cloud.x < -cloudBoundary || cloud.x > windowWidth + cloudBoundary) {
        this.cloudDirections[i] *= -1
      }
    })
  }

  getHighScore = (): number => {
    return JSON.parse(localStorage.getItem('highscore') || `${windowHeight}`)
  }

  setHighscoreText = () => {
    const highscore = (windowHeight - groundHeight - this.highscore) / 20

    this.highscoreText?.setText(Math.floor(highscore) + 'm')
  }

  updateHighscore = () => {
    if (this.isPileAsleep()) {
      const top = this.pile?.getBounds().top ?? windowHeight

      const prevHighscore = this.highscore

      this.highscore = Math.min(top, this.highscore)

      if (this.highscore !== prevHighscore) {
        localStorage.setItem('highscore', String(this.highscore))
      }

      if (this.highscoreLine && this.highscoreText) {
        this.highscoreLine.y = this.highscore
        this.highscoreText.y = this.highscore + 10
        this.setHighscoreText()
      }
    }
  }

  resetHookedAngle = () => {
    this.hookedPiece?.setAngle(this.hookedPieceAngle)
  }

  handleInput = () => {
    if (!this.crane) {
      return
    }

    if (this.isMovingDown || this.isMovingUp) {
      const y = this.crane.arm.y

      if (this.isMovingUp) {
        this.crane.arm.setY(Math.max(-cameraMaxY, y - craneArmSpeedUp))
      } else if (this.isMovingDown) {
        this.crane.arm.setY(Math.min(craneArmY, y + craneArmSpeedDown))
      }

      // sync anchor position to new arm position
      this.crane?.anchor.setY(this.crane.arm.getTopCenter().y + craneAnchorY)
    }

    if (this.isMovingLeft || this.isMovingRight) {
      const x = this.crane.anchor.x

      if (this.isMovingLeft) {
        this.crane.anchor.setX(Math.max(craneArmMinX, x - craneArmSpeedLeft))
      } else if (this.isMovingRight) {
        this.crane.anchor.setX(Math.min(craneArmMaxX, x + craneArmSpeedRight))
      }
    }
  }

  update = () => {
    this.updateClouds()

    this.updateHighscore()

    this.resetHookedAngle()

    this.handleInput()
  }
}

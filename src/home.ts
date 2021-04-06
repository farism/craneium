import * as Phaser from 'phaser'
import { createBackground } from './background'
import { createButton } from './button'
import { centerX, centerY } from './viewport'

export class HomeScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'HomeScene',
    })
  }

  preload = () => {
    this.load.image('button-play', './src/assets/button-play.png')
    this.load.image('cloud-1', './src/assets/cloud-1.png')
    this.load.image('cloud-2', './src/assets/cloud-2.png')
    this.load.image('cloud-3', './src/assets/cloud-3.png')
    this.load.image('craneium-logo', './src/assets/craneium-logo.png')
    this.load.image('procore-p2', './src/assets/procore-p2.png')
  }

  createLogo = () => {
    this.add.image(centerX, centerY - 200, 'craneium-logo').setScale(2)
  }

  createPlayButton = () => {
    const playBtn = createButton(
      centerX,
      centerY - 80,
      'button-play',
      () => {
        playBtn.disableInteractive()

        this.cameras.main.fadeOut(300, 0, 0, 0)

        this.cameras.main.once(
          Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
          (cam, effect) => {
            this.scene.start('PlayScene')
          }
        )
      },
      this
    )
  }

  createDirections = () => {
    const directions = [
      'Arrow Keys - Move Crane',
      'Space - Pick up and Drop Piece',
      'Enter - Add piece',
    ]

    const t = this.add.text(0, centerY, directions.join('\n\n'), {
      fontSize: '24px',
      align: 'center',
      resolution: 1,
    })

    t.setShadow(-1, 2, 'rgba(0,0,0,0.5)', 0)

    t.x = centerX - t.width / 2
  }

  create = () => {
    createBackground(this)

    this.createLogo()

    this.createPlayButton()

    this.createDirections()
  }
}

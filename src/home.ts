import * as Phaser from 'phaser'
import { createBackground } from './background'
import { createButton } from './button'
import { centerX, centerY } from './viewport'

console.log(Phaser)

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
    this.load.image('craneium-logo', './src/assets/craneium-logo.png')
    this.load.image('procore-p2', './src/assets/procore-p2.png')
  }

  createLogo = () => {
    this.add.image(centerX, centerY - 200, 'craneium-logo').setScale(2)
  }

  createPlayButton = () => {
    const playBtn = createButton(
      centerX,
      centerY,
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

  create = () => {
    createBackground(this)

    this.createLogo()

    this.createPlayButton()
  }
}

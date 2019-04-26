import { WINDOW_WIDTH } from '../config'
import { createBackground } from './terrain'

const CENTER_X = WINDOW_WIDTH / 2

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
    this.load.image('dolphin-studios', './src/assets/dolphin-studios.png')
    this.load.image('procore-p2', './src/assets/procore-p2.png')
  }

  create = () => {
    createBackground(this)

    this.add.image(CENTER_X, 100, 'craneium-logo').setScale(2)
    this.add.image(CENTER_X, 200, 'dolphin-studios').setScale(2)

    const play = this.add
      .image(CENTER_X, 325, 'button-play')
      .setScale(2)
      .setInteractive()

    play.on('pointerup', () => {
      this.scene.switch('ModeScene')
    })

    const credits = this.add
      .image(CENTER_X, 450, 'button-play')
      .setScale(2)
      .setInteractive()

    credits.on('pointerup', () => {
      this.scene.switch('CreditsScene')
    })
  }

  update = dt => {}
}

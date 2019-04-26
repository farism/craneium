import { WINDOW_WIDTH } from '../config'
import { createBackground, addControls } from './terrain'

const CENTER_X = WINDOW_WIDTH / 2

export class ModeScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'ModeScene',
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
    addControls(this)

    this.add.image(CENTER_X, 100, 'craneium-logo').setScale(2)
    this.add.image(CENTER_X, 200, 'dolphin-studios').setScale(2)

    const countdown = this.add
      .image(CENTER_X, 325, 'button-play')
      .setScale(2)
      .setInteractive()

    countdown.on('pointerup', () => {
      this.scene.switch('PlayScene')
    })

    const limit = this.add
      .image(CENTER_X, 450, 'button-play')
      .setScale(2)
      .setInteractive()

    limit.on('pointerup', () => {
      this.scene.switch('PlayScene')
    })
  }

  update = dt => {}
}

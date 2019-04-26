import { WINDOW_WIDTH } from '../config'
import { createBackground, addControls } from './terrain'
import { addButton } from '../button'

const CENTER_X = WINDOW_WIDTH / 2

export class ModeScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'ModeScene',
    })
  }

  preload = () => {
    this.load.image('button-back', './src/assets/button-back.png')
    this.load.image('button-set', './src/assets/button-set.png')
    this.load.image('button-time', './src/assets/button-time.png')
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

    const onClickBack = () => {
      this.scene.switch('HomeScene')
    }

    const onClickSet = () => {
      this.scene.switch('PlayScene')
    }

    const onClickTime = () => {
      this.scene.switch('PlayScene')
    }

    addButton(50, 50, 'button-back', onClickBack, this)

    addButton(CENTER_X, 325, 'button-set', onClickSet, this)

    addButton(CENTER_X, 450, 'button-time', onClickTime, this)
  }

  update = dt => {}
}

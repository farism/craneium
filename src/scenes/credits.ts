import {
  addSky,
  addOcean,
  addGrass,
  addGround,
  addCloud,
  addProcoreP2,
} from './terrain'
import { WINDOW_WIDTH } from '../config'

export class CreditsScene extends Phaser.Scene {
  faris?: Phaser.GameObjects.Image
  remy?: Phaser.GameObjects.Image
  kevin?: Phaser.GameObjects.Image

  constructor() {
    super({
      key: 'CreditsScene',
    })
  }

  preload = () => {
    this.load.image('cloud-1', './src/assets/cloud-1.png')
    this.load.image('cloud-2', './src/assets/cloud-2.png')
    this.load.image('craneium-logo', './src/assets/craneium-logo.png')
    this.load.image('dolphin-studios', './src/assets/dolphin-studios.png')
    this.load.image('person-faris', './src/assets/person-faris.png')
    this.load.image('person-kevin', './src/assets/person-kevin.png')
    this.load.image('person-remy', './src/assets/person-remy.png')
    this.load.image('procore-p2', './src/assets/procore-p2.png')
  }

  create = () => {
    addSky(this)
    addOcean(this)
    addGrass(this)
    addGround(this)
    addCloud(200, 200, 'cloud-1', this)
    addCloud(750, 300, 'cloud-2', this)
    addProcoreP2(this)

    this.add.image(WINDOW_WIDTH / 2, 100, 'craneium-logo').setScale(2)
    this.add.image(WINDOW_WIDTH / 2, 200, 'dolphin-studios').setScale(2)
    this.kevin = this.add.image(200, 400, 'person-kevin').setScale(2)
    this.add.text(this.kevin.x + 75, this.kevin.y, 'Kevin Chu')
    this.faris = this.add.image(500, 450, 'person-faris').setScale(2)
    this.add.text(this.faris.x + 75, this.faris.y, 'Faris Mustafa')
    this.remy = this.add.image(800, 400, 'person-remy').setScale(2)
    this.add.text(this.remy.x + 75, this.remy.y, 'Remy Younes')
  }

  update = dt => {
    this.kevin && this.kevin.setY(this.kevin.y + Math.sin(dt / 1000 + 1000) / 3)
    this.faris && this.faris.setY(this.faris.y + Math.sin(dt / 1000 + 2000) / 3)
    this.remy && this.remy.setY(this.remy.y + Math.sin(dt / 1000 + 3000) / 3)
  }
}

import 'phaser'
import { HomeScene } from './home'
import { PlayScene } from './play'
import { windowHeight, windowWidth } from './viewport'

const config = {
  antialias: false,
  height: windowHeight,
  parent: 'game',
  physics: {
    default: 'matter',
    matter: {
      enableSleeping: true,
      // debug: true,
    },
  },
  scene: [HomeScene, PlayScene],
  // scene: [PlayScene, HomeScene],
  type: Phaser.AUTO,
  width: windowWidth,
}

export class Game extends Phaser.Game {
  constructor() {
    super(config)
  }
}

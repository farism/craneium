import 'phaser'
import { WINDOW_WIDTH, WINDOW_HEIGHT } from './config'
import { HomeScene } from './scenes/home'
import { ModeScene } from './scenes/mode'
import { CreditsScene } from './scenes/credits'
import { PlayScene } from './scenes/play'

const config = {
  antialias: false,
  height: WINDOW_HEIGHT,
  parent: 'game',
  physics: {
    default: 'matter',
    matter: {
      // debug: true,
    },
    arcade: {
      // debug: true,
    },
  },
  scene: [HomeScene, ModeScene, CreditsScene, PlayScene],
  type: Phaser.AUTO,
  width: WINDOW_WIDTH,
}

export class Game extends Phaser.Game {
  constructor(config) {
    super(config)
  }
}

window.addEventListener('load', () => {
  const game = new Game(config)
})

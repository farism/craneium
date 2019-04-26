import 'phaser'
import { WINDOW_WIDTH, WINDOW_HEIGHT } from './config'
import { PlayScene } from './scenes/play'
import { CreditsScene } from './scenes/credits'

const config = {
  antialias: false,
  height: WINDOW_HEIGHT,
  parent: 'game',
  physics: {
    default: 'matter',
    matter: {
      debug: true,
    },
    arcade: {
      debug: true,
    },
  },
  scene: [CreditsScene, PlayScene],
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

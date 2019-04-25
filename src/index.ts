import 'phaser'
import { WINDOW_WIDTH, WINDOW_HEIGHT } from './config'
import { MainScene } from './scenes/play'

const config: GameConfig = {
  width: WINDOW_WIDTH,
  height: WINDOW_HEIGHT,
  type: Phaser.AUTO,
  parent: 'game',
  scene: MainScene,
  physics: {
    default: 'matter',
    matter: {
      debug: true,
    },
  },
}

export class Game extends Phaser.Game {
  constructor(config: GameConfig) {
    super(config)
  }
}

window.addEventListener('load', () => {
  const game = new Game(config)
})

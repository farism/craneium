import 'phaser'
import { MainScene } from './scenes/mainScene'

const config: GameConfig = {
  width: 1024,
  height: 768,
  type: Phaser.AUTO,
  parent: 'game',
  scene: MainScene,
  physics: {
    default: 'matter',
    arcade: {
      gravity: { y: 200 },
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

export class MainScene extends Phaser.Scene {
  private phaserSprite: Phaser.GameObjects.Sprite

  constructor() {
    super({
      key: 'MainScene',
    })
  }

  preload(): void {
    this.load.image('block', './src/boilerplate/assets/crate.png')
  }

  create(): void {
    const block = this.matter.add.image(200, 200, 'block')

    block.setFriction(0.05)
    block.setFrictionAir(0.0005)
    block.setBounce(0.9)
    block.setSize(64, 64)
  }
}

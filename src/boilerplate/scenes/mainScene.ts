import * as Camera from '../camera'

/**
 * @author       Digitsensitive <digit.sensitivee@gmail.com>
 * @copyright    2018 - 2019 digitsensitive
 * @license      Digitsensitive
 */
export class MainScene extends Phaser.Scene {
  private block: Phaser.Physics.Matter.Image
  private platform: Phaser.Physics.Matter.Image
  private cameraMode: Camera.CameraMode

  constructor() {
    super({
      key: 'MainScene',
    })
  }

  preload(): void {
    this.load.image('block', './src/boilerplate/assets/crate.png')
    this.load.image('platform', './src/boilerplate/assets/platform.png')
  }
  update(): void {
    Camera.updateCamera({
      canvas: this.sys.game.canvas,
      mode: this.cameraMode,
      camera: this.cameras.main,
      target: this.block,
    })
  }

  create(): void {
    // CAMERA
    const { centerX, centerY } = this.cameras.main
    this.cameras.main.centerOnX(centerX)
    this.cameras.main.centerOnY(-centerY)
    this.cameraMode = Camera.CameraModeNS.fit

    // PLATFORM
    this.platform = this.matter.add
      .image(0, 450, 'platform', null, { isStatic: true })
      .setDisplaySize(800, 50)
      .setPosition(centerX, 0)

    // BLOCKS
    this.block = this.matter.add.image(centerX, -centerY, 'block')
    this.block.setFriction(0.05)
    this.block.setFrictionAir(0.0005)
    this.block.setBounce(2)
  }
}

import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../config'

export const GROUND_HEIGHT = 70
export const GRASS_HEIGHT = GROUND_HEIGHT + 30
export const OCEAN_HEIGHT = GRASS_HEIGHT + 40
export const SKY_HEIGHT = WINDOW_HEIGHT * 1000
export const GROUND_COLOR = '#966014'
export const GRASS_COLOR = '#3e9b00'
export const OCEAN_COLOR = '#034096'
export const SKY_COLOR = '#27b5fe'
export const CONTROLS_COLOR = '#e89522'
export const CONTROLS_TEXT =
  'W - Up    S - Down    A - Left    D - Right    Space - Pickup/Drop    Enter - Add Piece'

export const addTerrain = (
  height: number,
  color: string,
  scene: Phaser.Scene
) => {
  return scene.add.rectangle(
    WINDOW_WIDTH / 2,
    WINDOW_HEIGHT - height / 2,
    WINDOW_WIDTH,
    height,
    Phaser.Display.Color.HexStringToColor(color).color
  )
}

export const addSky = (scene: Phaser.Scene) => {
  return addTerrain(SKY_HEIGHT, SKY_COLOR, scene)
}

export const addOcean = (scene: Phaser.Scene) => {
  return addTerrain(OCEAN_HEIGHT, OCEAN_COLOR, scene)
}
export const addGrass = (scene: Phaser.Scene) => {
  return addTerrain(GRASS_HEIGHT, GRASS_COLOR, scene)
}

export const addGround = (scene: Phaser.Scene) => {
  const ground = addTerrain(GROUND_HEIGHT, GROUND_COLOR, scene)

  const obj = scene.matter.add.rectangle(
    WINDOW_WIDTH / 2,
    WINDOW_HEIGHT - GROUND_HEIGHT / 2,
    WINDOW_WIDTH,
    GROUND_HEIGHT,
    {
      isStatic: true,
    }
  )

  return obj
}

export const addCloud = (
  x: number,
  y: number,
  id: string,
  scene: Phaser.Scene
) => {
  scene.add.image(x, y, id).setScale(2)
}

export const addProcoreP2 = (scene: Phaser.Scene) => {
  scene.add
    .image(0, WINDOW_HEIGHT - GRASS_HEIGHT + 20, 'procore-p2')
    .setScale(2)
    .setOrigin(0, 1)
}

export const addControls = (scene: Phaser.Scene) => {
  const text = scene.add
    .text(0, WINDOW_HEIGHT - GROUND_HEIGHT / 2 + 10, CONTROLS_TEXT)
    .setColor(CONTROLS_COLOR)

  text.setX(WINDOW_WIDTH / 2 - text.width / 2)
}

export const createBackground = (scene: Phaser.Scene) => {
  addSky(scene)
  addOcean(scene)
  addGrass(scene)
  addCloud(200, 200, 'cloud-1', scene)
  addCloud(750, 300, 'cloud-2', scene)
  addProcoreP2(scene)

  return addGround(scene)
}

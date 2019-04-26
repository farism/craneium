import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../config'

const GROUND_HEIGHT = 70
const GRASS_HEIGHT = GROUND_HEIGHT + 30
const OCEAN_HEIGHT = GRASS_HEIGHT + 40
const SKY_HEIGHT = WINDOW_HEIGHT * 1000
const GROUND_COLOR = '#966014'
const GRASS_COLOR = '#3e9b00'
const OCEAN_COLOR = '#034096'
const SKY_COLOR = '#27b5fe'

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

  scene.matter.add.rectangle(
    WINDOW_WIDTH / 2,
    WINDOW_HEIGHT - GROUND_HEIGHT / 2,
    WINDOW_WIDTH,
    GROUND_HEIGHT,
    {
      isStatic: true,
    }
  )

  return ground
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

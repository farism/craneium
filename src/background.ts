import { PlayScene } from './play'
import { windowHeight, windowWidth } from './viewport'

export const skyHeight = windowHeight * 1000
export const groundHeight = 70
const grassHeight = 30
const oceanHeight = 40
const grassOffset = groundHeight + grassHeight
const oceanOffset = grassOffset + oceanHeight
const groundColor = '#966014'
const grassColor = '#3e9b00'
const oceanColor = '#034096'
const skyColor = '#27b5fe'

function createTerrain(height: number, color: string, scene: Phaser.Scene) {
  return scene.add.rectangle(
    windowWidth / 2,
    windowHeight - height / 2,
    windowWidth,
    height,
    Phaser.Display.Color.HexStringToColor(color).color
  )
}

function createSky(scene: Phaser.Scene) {
  return createTerrain(skyHeight, skyColor, scene)
}

function createOcean(scene: Phaser.Scene) {
  return createTerrain(oceanOffset, oceanColor, scene)
}
function createGrass(scene: Phaser.Scene) {
  return createTerrain(grassOffset, grassColor, scene)
}

function createGround(scene: Phaser.Scene, category: number) {
  createTerrain(groundHeight, groundColor, scene)

  const obj = scene.matter.add.rectangle(
    windowWidth / 2,
    windowHeight - groundHeight / 2,
    windowWidth,
    groundHeight,
    {
      isStatic: true,
      friction: 1,
      collisionFilter: {
        category,
      },
    }
  )

  return obj
}

function createCloud(x: number, y: number, id: string, scene: Phaser.Scene) {
  scene.add.image(x, y, id).setScale(2)
}

function createBuilding(scene: Phaser.Scene) {
  scene.add
    .image(0, windowHeight - grassOffset + 20, 'procore-p2')
    .setScale(2)
    .setOrigin(0, 1)
}

export function createBackground(scene: PlayScene) {
  createSky(scene)
  createOcean(scene)
  createGrass(scene)
  createCloud(200, 200, 'cloud-1', scene)
  createCloud(750, 300, 'cloud-2', scene)
  createBuilding(scene)
  createGround(scene, scene.category)
}

import { randomInRange } from './utils'
import { cameraMaxY, windowHeight, windowWidth } from './viewport'

export const skyHeight = windowHeight * 3
export const groundHeight = 70
const grassHeight = 100
const oceanHeight = 140
const groundColor = '#966014'
const grassColor = '#3e9b00'
const oceanColor = '#034096'

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
  const obj = scene.add.graphics()
  obj.fillGradientStyle(0x000000, 0x000000, 0x27b5fe, 0x27b5fe, 1)
  obj.fillRect(0, windowHeight - skyHeight, windowWidth, skyHeight)

  return obj
}

function createOcean(scene: Phaser.Scene) {
  return createTerrain(oceanHeight, oceanColor, scene)
}
function createGrass(scene: Phaser.Scene) {
  return createTerrain(grassHeight, grassColor, scene)
}

function createGround(scene: Phaser.Scene) {
  return createTerrain(groundHeight, groundColor, scene)
}

function createBuilding(scene: Phaser.Scene) {
  return scene.add
    .image(0, windowHeight - grassHeight + 20, 'procore-p2')
    .setScale(2)
    .setOrigin(0, 1)
}

function createCloud(
  x: number,
  y: number,
  scale: number,
  id: string,
  scene: Phaser.Scene
) {
  return scene.add.image(x, y, id).setScale(scale)
}

function createClouds(scene: Phaser.Scene) {
  const clouds = ['cloud-1', 'cloud-2', 'cloud-3']
  const container = scene.add.container()
  container.y = -skyHeight + windowHeight

  for (let i = 0; i < 10; i++) {
    container.add([
      createCloud(
        randomInRange(0, windowWidth),
        randomInRange(0, skyHeight - windowHeight / 2),
        randomInRange(0.75, 2),
        clouds[Math.floor(Math.random() * 3)],
        scene
      ),
    ])
  }

  return container
}
function createStars(scene: Phaser.Scene) {
  const container = scene.add.container()
  container.y = -cameraMaxY

  for (let i = 0; i < 50; i++) {
    container.add([
      scene.add
        .graphics()
        .fillStyle(0xffffbf)
        .fillPoint(
          Math.random() * windowWidth,
          Math.random() * (cameraMaxY - skyHeight + windowHeight),
          Math.max(1, Math.floor(Math.random() * 3))
        ),
    ])
  }

  return container
}

export function createBackground(scene: Phaser.Scene, category: number = 0) {
  const sky = createSky(scene)
  const stars = createStars(scene)
  const clouds = createClouds(scene)
  const ocean = createOcean(scene)
  const grass = createGrass(scene)
  const building = createBuilding(scene)
  const ground = createGround(scene)

  return { sky, stars, clouds, ocean, grass, building, ground }
}

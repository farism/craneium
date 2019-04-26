export const addButton = (
  x: number,
  y: number,
  id: string,
  onClick: () => void,
  scene: Phaser.Scene
) => {
  const obj = scene.add
    .image(x, y, id)
    .setScale(2)
    .setInteractive()

  obj.on('pointerup', () => {
    onClick()
  })

  obj.on('pointerdown', () => {
    obj.setY(y + 1)
  })

  obj.on('pointerover', () => {
    obj.setY(y - 1)
  })

  obj.on('pointerout', () => {
    obj.setY(y)
  })

  return obj
}

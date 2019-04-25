export namespace CameraModeNS {
  export const origin = 'origin'
  export const fit = 'fit'
  export const follow = 'bold'
}

export type CameraMode =
  | typeof CameraModeNS.origin
  | typeof CameraModeNS.fit
  | typeof CameraModeNS.follow

export const fit = ({ canvas, camera, target }) => {
  const padding = Math.max(target.displayWidth, target.displayHeight)

  const bodyHeight = Math.abs(target.body.position.y)

  const maxY = Math.max(canvas.height, bodyHeight + padding)
  const { width, height } = canvas
  const ratio = height / maxY
  const cameraHeight = height / ratio
  const cameraCenterY = -cameraHeight / 2
  camera.setZoom(ratio)
  camera.centerOnY(cameraCenterY)
}

export const follow = ({ camera, target, lerp = 0.5 }) => {
  camera.startFollow(target, true, lerp, lerp)
}

export const updateCamera = ({ mode, canvas, camera, target, lerp = 0.5 }) => {
  if (mode === CameraModeNS.fit) {
    fit({ canvas, camera, target })
  } else if (mode === CameraModeNS.fit) {
    follow({ camera, target })
  } else {
    // Replace
    // origin({ camera, target })
  }
}

require('phaser/src/polyfills')

const Const = require('phaser/src/const')

const Extend = require('phaser/src/utils/object/Extend')

const Phaser = {
  Cameras: {
    Scene2D: require('phaser/src/cameras/2d'),
  },
  Display: {
    Color: require('phaser/src/display/color'),
  },
  Events: require('phaser/src/events/EventEmitter'),
  Game: require('phaser/src/core/Game'),
  GameObjects: {
    Image: require('phaser/src/gameobjects/image/Image'),
    DisplayList: require('phaser/src/gameobjects/DisplayList'),
    Graphics: require('phaser/src/gameobjects/graphics/Graphics.js'),
    Factories: {
      // Graphics is only used for MatterJS debug drawing
      Graphics: require('phaser/src/gameobjects/graphics/GraphicsFactory'),
      Image: require('phaser/src/gameobjects/image/ImageFactory'),
      Rectangle: require('phaser/src/gameobjects/shape/rectangle/RectangleFactory'),
      Container: require('phaser/src/gameobjects/container/ContainerFactory'),
      TileSprite: require('phaser/src/gameobjects/tilesprite/TileSpriteFactory'),
      Text: require('phaser/src/gameobjects/text/TextFactory'),
    },
  },
  Input: require('phaser/src/input'),
  Loader: require('phaser/src/loader'),
  Physics: {
    Matter: require('phaser/src/physics/matter-js'),
  },
  Scene: require('phaser/src/scene/Scene'),
  ScenePlugin: require('phaser/src/scene/ScenePlugin'),
}

module.exports = Extend(false, Phaser, Const)

global.Phaser = module.exports

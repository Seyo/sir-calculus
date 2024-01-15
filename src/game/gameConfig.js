import Phaser from 'phaser'
import { backgroundImages, getBgName } from './worldHandler'

function preload() {
  this.load.aseprite('player', '/sircalculus.png', '/sircalculus.json')
  this.load.aseprite('calculator', '/calculator.png', '/calculator.json')
  this.load.image('initBackground', './backgrounds/bg_3.png')
  backgroundImages.forEach((bg) => {
    const bgName = getBgName(bg)
    this.load.image(bgName, bg)
  })
}
export const gameConfig = (create) => ({
  type: Phaser.AUTO,
  width: 1024,
  height: 800,
  parent: 'phaser-game',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: {
    preload: preload,
    create: create,
  },
})

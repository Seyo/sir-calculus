import Phaser from 'phaser'
import { backgroundImages, getBgName } from './worldHandler'

function preload() {
  this.load.aseprite('player', '/sir2.png', '/sir2.json')
  this.load.aseprite('calculator', '/calculator.png', '/calculator.json')
  this.load.spritesheet('mech1', '/mech1.png', { frameWidth: 64, frameHeight: 64 });
  this.load.spritesheet('mech2', '/mech2.png', { frameWidth: 64, frameHeight: 64 });
  backgroundImages.forEach((bg) => {
    const bgName = getBgName(bg)
    this.load.image(bgName, bg)
  })
  this.load.image('ground', '/ground1.png')
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

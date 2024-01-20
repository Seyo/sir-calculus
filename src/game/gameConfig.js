import Phaser from 'phaser'
import { backgroundImages, foregroundImages, getBgName, getFgName } from './worldHandler'
import { ENEMIES_LIST } from './gameConstants';

function preload() {
  this.load.aseprite('player', '/sir2.png', '/sir2.json')
  this.load.aseprite('calculator', '/calculator.png', '/calculator.json')
  ENEMIES_LIST.forEach(m => {
    this.load.spritesheet(m, `/${m}.png`, { frameWidth: 64, frameHeight: 64 });
  })
  backgroundImages.forEach((bg) => {
    const bgName = getBgName(bg)
    this.load.image(bgName, bg)
  })
  foregroundImages.forEach((fg) => {
    const fgName = getFgName(fg)
    this.load.image(fgName, fg)
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

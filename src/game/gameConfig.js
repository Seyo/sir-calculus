import Phaser from 'phaser'
import { backgroundImages, buildWorld, foregroundImages, getBgName, getFgName } from './worldHandler'
import { ENEMIES_LIST, PLAYER_START_X, SCALE } from './gameConstants';
import { gameScene, menuScene } from '../signals';

function preload(scene) {
  scene.load.aseprite('player', '/sir2.png', '/sir2.json')
  scene.load.aseprite('calculator', '/calculator.png', '/calculator.json')
  ENEMIES_LIST.forEach(m => {
    scene.load.spritesheet(m, `/${m}.png`, { frameWidth: 64, frameHeight: 64 });
  })
  backgroundImages.forEach((bg) => {
    const bgName = getBgName(bg)
    scene.load.image(bgName, bg)
  })
  foregroundImages.forEach((fg) => {
    const fgName = getFgName(fg)
    scene.load.image(fgName, fg)
  })
  scene.load.image('ground', '/ground1.png')
}

export const gameConfig = (create) => {
  class GameScene extends Phaser.Scene {
    constructor() {
      super('GameScene');
    }
    preload() {
      preload(this)
    }
    create() {
      create(this)
    }
  }
  class MenuScene extends Phaser.Scene {
    constructor() {
      super('MenuScene');
    }
    preload() {
      preload(this)
    }
    create() {
      buildWorld(this)
      const p = this.add.sprite(PLAYER_START_X, 328, 'player')
      p.anims.createFromAseprite('player')
      p.setScale(SCALE)
      p.play({ key: 'idle', repeat: -1 })
    }
  }
  gameScene.value = GameScene
  menuScene.value = MenuScene
  return {
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
    scene: [MenuScene],
  }
}

import { backgroundImages, foregroundImages } from "../../assets/images"
import { ENEMIES_LIST, PLAYER_START_X, SCALE } from "../gameConstants"
import { buildWorld, getBgName, getFgName } from "../setup/worldHandler"

function preload(scene: Phaser.Scene) {
  scene.load.aseprite('player', '/sir2.png', '/sir2.json')

  ENEMIES_LIST.forEach((m) => {
    scene.load.spritesheet(m, `/${m}.png`, { frameWidth: 64, frameHeight: 64 })
  })
  backgroundImages.forEach((bg: string) => {
    const bgName = getBgName(bg)
    scene.load.image(bgName, bg)
  })
  foregroundImages.forEach((fg: string) => {
    const fgName = getFgName(fg)
    scene.load.image(fgName, fg)
  })
  scene.load.image('ground', '/ground1.png')
}

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene')
  }
  preload() {
    preload(this)
  }
  create() {
    buildWorld(this)
    const thisScene = this as Phaser.Scene
    const p = thisScene.add.sprite(PLAYER_START_X, 328, 'player')
    p.anims.createFromAseprite('player')
    p.setScale(SCALE)
    p.play({ key: 'idle', repeat: -1 })
  }
}

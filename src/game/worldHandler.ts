import Phaser from 'phaser'
import { backgroundImages, foregroundImages } from '../assets/images'
import { backgroundImage, foregroundImage } from '../signals'
import { getRandomInt } from '../utils/utils'

export const getBgName = (filepath: string) => filepath.replace('/backgrounds/', '').replace('_.png', '')
export const getFgName = (filepath: string) => filepath.replace('/foregrounds/', '').replace('_.png', '')

export const setRandomBackground = (bg: Phaser.GameObjects.Image) => {
  const bgIndex = getRandomInt(0, backgroundImages.length)
  const bgName = getBgName(backgroundImages[bgIndex])
  bg.setTexture(bgName)
}
export const setRandomforeground = (fg: Phaser.GameObjects.Image) => {
  const fgIndex = getRandomInt(0, foregroundImages.length)
  const fgName = getFgName(foregroundImages[fgIndex])
  fg.setTexture(fgName)
}

export const buildWorld = (scene: Phaser.Scene) => {
  const bg = scene.add.image(0, 0, 'bg_true_00001')
  setRandomBackground(bg)
  bg.setScale(4)
  bg.setOrigin(0, 0)
  backgroundImage.value = bg

  const fg = scene.add.image(0, 434, 'fg_true_00001')
  setRandomforeground(fg)
  fg.setScale(4)
  fg.setOrigin(0, 0)
  foregroundImage.value = fg

  //ground texture
  scene.add
    .image(256 * 0, 370, 'ground')
    .setOrigin(0, 0)
    .setScale(2)
  scene.add
    .image(256 * 1, 370, 'ground')
    .setOrigin(0, 0)
    .setScale(2)
  scene.add
    .image(256 * 2, 370, 'ground')
    .setOrigin(0, 0)
    .setScale(2)
  scene.add
    .image(256 * 3, 370, 'ground')
    .setOrigin(0, 0)
    .setScale(2)

  // railing
  scene.add.rectangle(0, 370, 1024, 10, 0x000000).setAlpha(0.3).setOrigin(0, 0)
  scene.add.rectangle(0, 350, 1024, 20, 0x392d35).setAlpha(1).setOrigin(0, 0)
  scene.add.rectangle(0, 345, 1024, 5, 0x715969).setAlpha(1).setOrigin(0, 0)

  //ground edge
  const thickness = 10
  scene.add
    .rectangle(0, 434 - thickness, 1024, thickness, 0x000000)
    .setAlpha(0.8)
    .setOrigin(0, 0)

  //foreground shadows
  scene.add.rectangle(0, 434, 1024, 20, 0x000000).setAlpha(0.2).setOrigin(0, 0)
  scene.add.rectangle(0, 434, 1024, 40, 0x000000).setAlpha(0.2).setOrigin(0, 0)
  scene.add.rectangle(0, 434, 1024, 60, 0x000000).setAlpha(0.2).setOrigin(0, 0)

  //foreground dimmer
  scene.add.rectangle(0, 434, 1024, 400, 0x000000).setAlpha(0.7).setOrigin(0, 0)

  return {}
}

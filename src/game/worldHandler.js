import { backgroundImages, foregroundImages } from "../assets/images"
import { backgroundImage, foregroundImage } from "../signals"
import { getRandomInt } from "../utils/utils"

export const getBgName = (filepath) => filepath.replace('/backgrounds/', '').replace('_.png', '')
export const getFgName = (filepath) => filepath.replace('/foregrounds/', '').replace('_.png', '')

export const setRandomBackground = (bg) => {
  const bgIndex = getRandomInt(0, backgroundImages.length)
  const bgName = getBgName(backgroundImages[bgIndex])
  bg.setTexture(bgName)
}
export const setRandomforeground = (fg) => {
  const fgIndex = getRandomInt(0, foregroundImages.length)
  const fgName = getFgName(foregroundImages[fgIndex])
  fg.setTexture(fgName)
}

export const buildWorld = (scene) => {
  backgroundImage.value = scene.add.image(0, 0, 'bg_true_00001')
  setRandomBackground(backgroundImage.value)
  backgroundImage.value.setScale(4)
  backgroundImage.value.setOrigin(0, 0)

  // const blackWall = scene.add.rectangle(0, 400, 1024, 400, 0x000000)
  // blackWall.setOrigin(0, 0)

  foregroundImage.value = scene.add.image(0, 434, 'fg_true_00001')
  setRandomforeground(foregroundImage.value)
  foregroundImage.value.setScale(4)
  foregroundImage.value.setOrigin(0, 0)

  //ground texture
  scene.add.image(256 * 0, 370, 'ground').setOrigin(0, 0).setScale(2)
  scene.add.image(256 * 1, 370, 'ground').setOrigin(0, 0).setScale(2)
  scene.add.image(256 * 2, 370, 'ground').setOrigin(0, 0).setScale(2)
  scene.add.image(256 * 3, 370, 'ground').setOrigin(0, 0).setScale(2)

  // railing
  scene.add.rectangle(0, 370, 1024, 10, 0x000000).setAlpha(0.3).setOrigin(0, 0)
  scene.add.rectangle(0, 350, 1024, 20, 0x392d35).setAlpha(1).setOrigin(0, 0)
  scene.add.rectangle(0, 345, 1024, 5, 0x715969).setAlpha(1).setOrigin(0, 0)

  //ground edge
  const thickness = 10
  scene.add.rectangle(0, 434 - thickness, 1024, thickness, 0x000000).setAlpha(0.8).setOrigin(0, 0)

  //foreground shadows
  scene.add.rectangle(0, 434, 1024, 20, 0x000000).setAlpha(0.2).setOrigin(0, 0)
  scene.add.rectangle(0, 434, 1024, 40, 0x000000).setAlpha(0.2).setOrigin(0, 0)
  scene.add.rectangle(0, 434, 1024, 60, 0x000000).setAlpha(0.2).setOrigin(0, 0)

  //foreground dimmer
  scene.add.rectangle(0, 434, 1024, 400, 0x000000).setAlpha(0.7).setOrigin(0, 0)


  return {}
}

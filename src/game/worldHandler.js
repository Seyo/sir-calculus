import { getRandomInt } from "../utils/utils"

export const backgroundImages = [
  '/backgrounds/bg_true_00001_.png',
  '/backgrounds/bg_true_00002_.png',
  '/backgrounds/bg_true_00003_.png',
  '/backgrounds/bg_true_00004_.png',
  '/backgrounds/bg_true_00005_.png',
  '/backgrounds/bg_true_00006_.png',
  '/backgrounds/bg_true_00007_.png',
  '/backgrounds/bg_true_00008_.png',
  '/backgrounds/bg_true_00009_.png',
  '/backgrounds/bg_true_00010_.png',
  '/backgrounds/bg_true_00011_.png',
  '/backgrounds/bg_true_00012_.png',
  '/backgrounds/bg_true_00013_.png',
  '/backgrounds/bg_true_00014_.png',
  '/backgrounds/bg_true_00015_.png',
  '/backgrounds/bg_true_00016_.png',
  '/backgrounds/bg_true_00017_.png',
  '/backgrounds/bg_true_00018_.png',
  '/backgrounds/bg_true_00019_.png',
  '/backgrounds/bg_true_00020_.png',
  '/backgrounds/bg_true_00021_.png',
  '/backgrounds/bg_true_00022_.png',
  '/backgrounds/bg_true_00023_.png',
  '/backgrounds/bg_true_00024_.png',
  '/backgrounds/bg_true_00025_.png',
  '/backgrounds/bg_true_00026_.png',
  '/backgrounds/bg_true_00027_.png',
  '/backgrounds/bg_true_00028_.png',
  '/backgrounds/bg_true_00029_.png',
  '/backgrounds/bg_true_00030_.png',
  '/backgrounds/bg_true_00031_.png',
  '/backgrounds/bg_true_00032_.png',
  '/backgrounds/bg_true_00033_.png',
  '/backgrounds/bg_true_00034_.png',
  '/backgrounds/bg_true_00035_.png',
  '/backgrounds/bg_true_00036_.png',
  '/backgrounds/bg_true_00037_.png',
  '/backgrounds/bg_true_00038_.png',
  '/backgrounds/bg_true_00039_.png',
  '/backgrounds/bg_true_00040_.png',
]

export const getBgName = (filepath) => filepath.replace('/backgrounds/', '').replace('_.png', '')
export const setRandomBackground = (bg) => {
  const bgIndex = getRandomInt(0, backgroundImages.length)
  const bgName = getBgName(backgroundImages[bgIndex])
  bg.setTexture(bgName)
}

export const buildWorld = (scene) => {
  const bg = scene.add.image(0, 0, 'bg_true_00001')
  setRandomBackground(bg)
  bg.setScale(4)
  bg.setOrigin(0, 0)

  const blackWall = scene.add.rectangle(0, 400, 1024, 400, 0x000000)
  blackWall.setOrigin(0, 0)

  
  scene.add.image(256 * 0, 370, 'ground').setOrigin(0, 0).setScale(2)
  scene.add.image(256 * 1, 370, 'ground').setOrigin(0, 0).setScale(2)
  scene.add.image(256 * 2, 370, 'ground').setOrigin(0, 0).setScale(2)
  scene.add.image(256 * 3, 370, 'ground').setOrigin(0, 0).setScale(2)
  
  scene.add.rectangle(0, 370, 1024, 10, 0x000000).setAlpha(0.3).setOrigin(0, 0)
  scene.add.rectangle(0, 350, 1024, 20, 0x392d35).setAlpha(1).setOrigin(0, 0)
  scene.add.rectangle(0, 345, 1024, 5, 0x715969).setAlpha(1).setOrigin(0, 0)

  
  // g1.setOrigin(0, 0)
  // g1.setScale(2)


  return { bg, blackWall }
}

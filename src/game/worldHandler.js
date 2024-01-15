import { getRandomInt } from "../utils/utils"

export const backgroundImages = [
  '/backgrounds/bg_00002_.png',
  '/backgrounds/bg_00003_.png',
  '/backgrounds/bg_00004_.png',
  '/backgrounds/bg_00005_.png',
  '/backgrounds/bg_00006_.png',
  '/backgrounds/bg_00007_.png',
  '/backgrounds/bg_00008_.png',
  '/backgrounds/bg_00009_.png',
  '/backgrounds/bg_00010_.png',
  '/backgrounds/bg_00011_.png',
  '/backgrounds/bg_00013_.png',
  '/backgrounds/bg_00014_.png',
  '/backgrounds/bg_00015_.png',
  '/backgrounds/bg_00016_.png',
  '/backgrounds/bg_00017_.png',
  '/backgrounds/bg_00018_.png',
  '/backgrounds/bg_00019_.png',
  '/backgrounds/bg_00020_.png',
  '/backgrounds/bg_00021_.png',
  '/backgrounds/bg_00022_.png',
  '/backgrounds/bg_00023_.png',
  '/backgrounds/bg_00024_.png',
  '/backgrounds/bg_00025_.png',
  '/backgrounds/bg_00026_.png',
  '/backgrounds/bg_00027_.png',
  '/backgrounds/bg_00028_.png',
  '/backgrounds/bg_00029_.png',
  '/backgrounds/bg_00030_.png',
  '/backgrounds/bg_00031_.png',
  '/backgrounds/bg_00032_.png',
  '/backgrounds/bg_00033_.png',
  '/backgrounds/bg_00034_.png',
  '/backgrounds/bg_00036_.png',
  '/backgrounds/bg_00037_.png',
  '/backgrounds/bg_00038_.png',
  '/backgrounds/bg_00039_.png',
  '/backgrounds/bg_00040_.png',
]

export const getBgName = (filepath) => filepath.replace('/backgrounds/', '').replace('_.png', '')
export const setRandomBackground = (bg) => {
  const bgIndex = getRandomInt(0, backgroundImages.length)
  const bgName = getBgName(backgroundImages[bgIndex])
  bg.setTexture(bgName)
}

export const buildWorld = (scene) => {
  const bg = scene.add.image(0, 0, 'initBackground')
  setRandomBackground(bg)
  bg.setOrigin(0, 0)

  const r1 = scene.add.rectangle(0, 400, 1024, 400, 0x000000)
  r1.setOrigin(0, 0)

  return { bg, r1 }
}

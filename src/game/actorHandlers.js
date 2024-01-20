import Phaser from 'phaser'
import { playerSprite } from "../signals"
import { registerAnimationListeners } from "./animationHandlers"
import { ENEMIES_LIST, PLAYER_START_X, SCALE } from "./gameConstants"

export const createActors = (scene) => {

  const enemiesList = ENEMIES_LIST
  const e = new Phaser.GameObjects.Sprite(scene, 375, 316, enemiesList[0]);
  scene.add.existing(e)
  e.setScale(SCALE)
  e.name = 'enemy'
  e.anims.create({
    key: 'hit_enemy',
    frames: scene.anims.generateFrameNames(enemiesList[0], { frames: [1, 2, 3, 4] }),
    frameRate: 12,
    repeat: 0
  });
  e.anims.create({
    key: 'idle_enemy',
    frames: scene.anims.generateFrameNames(enemiesList[0], { frames: [0] }),
    frameRate: 12,
    repeat: -1
  });
  
  const p = scene.add.sprite(PLAYER_START_X, 328, 'player')
  p.anims.createFromAseprite('player')
  p.setScale(SCALE)

  playerSprite.value = p
  registerAnimationListeners(p)

  p.play({ key: 'idle', repeat: -1 })
  e.playAfterDelay({ key: 'idle_enemy', repeat: -1 }, 200)


  return { p, e }
}

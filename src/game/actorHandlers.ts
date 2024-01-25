import Phaser from 'phaser'
import { registerAnimationListeners } from "./playerAnimationListeners"
import { ENEMIES_LIST, PLAYER_START_X, PLAYER_START_Y, SCALE } from "./gameConstants"
import { customSpriteType } from '../types'

const createEnemy = (scene: Phaser.Scene): customSpriteType => {

  const enemiesList = ENEMIES_LIST
  const e: customSpriteType = new Phaser.GameObjects.Sprite(
    scene,
    375,
    316,
    enemiesList[0]
  ) as customSpriteType;
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
  return e
}

const createPlayer = (scene: Phaser.Scene): customSpriteType => {
  const p: customSpriteType = scene.add.sprite(
    PLAYER_START_X,
    PLAYER_START_Y,
    "player"
  ) as customSpriteType;
  p.anims.createFromAseprite('player')
  p.setScale(SCALE)
  p.name = 'player'

  return p
}

export const createActors = (scene) => {
  const e = createEnemy(scene)
  const p = createPlayer(scene)

  registerAnimationListeners(p)

  p.play({ key: 'idle', repeat: -1 })
  e.playAfterDelay({ key: 'idle_enemy', repeat: -1 }, 200)


  return { p, e }
}

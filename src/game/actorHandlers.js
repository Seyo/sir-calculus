import { registerAnimationListeners } from "./animationHandlers"
import { PLAYER_START_X, SCALE } from "./gameConstants"

export const createActors = (scene) => {
  scene.anims.createFromAseprite('calculator')
  const enemy = scene.add.sprite(375, 316, 'calculator')

  scene.anims.createFromAseprite('player')
  const player = scene.add.sprite(PLAYER_START_X, 328, 'player')

  player.setScale(SCALE/2)
  enemy.setScale(SCALE / 2, SCALE / 2)

  registerAnimationListeners(player, enemy)

  player.play({ key: 'idle', repeat: -1 })
  enemy.playAfterDelay({ key: 'idle_enemy', repeat: -1 }, 200)

  return { player, enemy }
}

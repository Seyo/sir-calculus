import Phaser from 'phaser'
import { effect } from '@preact/signals-react'
import { backgroundImage, command, enemyHealth, level, playerSprite } from '../signals'
import { playHitEnemy, playIdle, playIdleEnemy, playMove, playMoveAndAttack1, playMoveAndAttack2, playMoveAndAttack3, playReset } from './animationHandlers'
import { setRandomBackground } from './worldHandler'
import { PLAYER_START_X } from './gameConstants'
import { changeEnemy } from '../signals/gameCommands'

export const setupCommandEffects = () => {
  return effect(() => {
    if (command.value.type === 'idle') {
      playIdle()
    } else if (command.value.type === 'attack1') {
      playMoveAndAttack1()
    } else if (command.value.type === 'attack2') {
      playMoveAndAttack2()
    } else if (command.value.type === 'attack3') {
      playMoveAndAttack3()
    } else if (command.value.type === 'reset') {
      playReset()
    } else if (command.value.type === 'move') {
      playMove(command.value.value)
    }
  })
}

export const setupEnemyHealthEffects = () => {
  return effect(() => {
    if (enemyHealth.value.current === 0) {
      playHitEnemy()
    }
  })
}

export const setupGameLevelEffects = (scene) => {
  return effect(() => {
    const p = playerSprite.value
    const bg = backgroundImage.value
    if (level.value.state === 'loading') {
      playMove(-1)
      scene.cameras.main.fadeOut(1000, 0, 0, 0)
      scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        setRandomBackground(bg)
        changeEnemy()
        playIdleEnemy()
        playIdle()
        p.x = PLAYER_START_X
      })
    } else if (level.value.state === 'loaded') {
      scene.cameras.main.fadeIn(1000, 0, 0, 0)

    }
  })
}

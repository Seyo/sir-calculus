import Phaser from 'phaser'
import { effect } from '@preact/signals-react'
import { command, enemyHealth, level } from '../signals'
import { playHitEnemy, playIdle, playIdleEnemy, playMoveAndAttack1, playMoveAndAttack2, playMoveAndAttack3, playMoveAndAttack4, playReset } from './animationHandlers'
import { setRandomBackground } from './worldHandler'

export const setupCommandEffects = (player) => {
  return effect(() => {
    if (command.value.type === 'idle') {
      playIdle(player)
    } else if (command.value.type === 'attack1') {
      playMoveAndAttack1(player)
    } else if (command.value.type === 'attack2') {
      playMoveAndAttack2(player)
    } else if (command.value.type === 'attack3') {
      playMoveAndAttack3(player)
    } else if (command.value.type === 'attack4') {
      playMoveAndAttack4(player)
    } else if (command.value.type === 'reset') {
      playReset(player)
    }
  })
}

export const setupEnemyHealthEffects = (enemy) => {
  return effect(() => {
    if (enemyHealth.value.current === 0) {
      playHitEnemy(enemy)
    }
  })
}

export const setupGameLevelEffects = (scene, bg, enemy) => {
  return effect(() => {
    if (level.value.state === 'loading') {
      scene.cameras.main.fadeOut(1000, 0, 0, 0)
      scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        setRandomBackground(bg)
        playIdleEnemy(enemy)
      })
    } else if (level.value.state === 'loaded') {
      scene.cameras.main.fadeIn(1000, 0, 0, 0)
    }
  })
}

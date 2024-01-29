import Phaser from 'phaser'
import { effect } from '@preact/signals-react'
import { attackDuration, attackTimer, backgroundImage, command, damage, enemyHealth, foregroundImage, game, gameEffect, level } from '../../signals'
import { playHitEnemy, playIdle, playIdleEnemy, playMove, playMoveAndAttack1, playMoveAndAttack2, playMoveAndAttack3, setPlayerXPos } from '../animationHandlers'
import { setRandomBackground, setRandomforeground } from '../setup/worldHandler'
import { PLAYER_START_X } from '../gameConstants'
import { changeEnemy } from '../../controllers/gameCommands'
import { commandType, damageType } from '../../types'

// Effect listening to game commands from UI
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
    } else if (command.value.type === 'move') {
      playMove(command.value.value)
    }
  })
}

// Effect listening to enemy helath changes
export const setupEnemyHealthEffects = () => {
  return effect(() => {
    if (enemyHealth.value.current === 0) {
      // TODO: build explosion animation for enemy
    }
  })
}

type gameResourcesType = { bg: Phaser.GameObjects.Image; fg: Phaser.GameObjects.Image; gameScene: Phaser.Scene }
const getGameResources = (): gameResourcesType | undefined => {
  const bg = backgroundImage.peek()
  const fg = foregroundImage.peek()
  const g = game.peek()
  const missingData = !(g && bg && fg)
  if (missingData) return

  const scene = g.scene
  const gameScene = scene.getScene('GameScene')
  if (!gameScene) return
  return { bg, fg, gameScene }
}

// Efect when changing level
export const setupGameLevelEffects = () => {
  return effect(() => {
    const levelValue = level.value
    const gameResources: gameResourcesType | undefined = getGameResources()

    if (!gameResources) return
    const { bg, fg, gameScene } = gameResources
    const { state } = levelValue

    if (state === 'loading') {
      playMove(-1)
      gameScene.cameras.main?.fadeOut(1000, 0, 0, 0)
      gameScene.cameras.main?.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        setRandomBackground(bg)
        setRandomforeground(fg)
        changeEnemy()
        playIdleEnemy()
        playIdle()
        setPlayerXPos(PLAYER_START_X)
      })
    } else if (state === 'loaded') {
      gameScene.cameras.main?.fadeIn(1000, 0, 0, 0)
    }
  })
}

// hit effect
export const setupHitEnemyEffect = () => {
  return effect(() => {
    if (gameEffect.value === 'hit') {
      playHitEnemy()
      const currentHits: damageType = damage.peek()
      const currentCommand: commandType = command.peek()
      damage.value = {
        state: 'inProgress',
        hits: [...currentHits.hits, currentCommand.value],
      }
      setTimeout(() => {
        gameEffect.value = ''
      }, 100)
    }
  })
}

// Effect to handle different attack time states
let timeout: NodeJS.Timeout
export const setupAttackTimerEffect = () => {
  return effect(() => {
    const { duration } = attackDuration.peek()
    const { state } = attackTimer.value

    if (state === 'running') {
      timeout = setTimeout(() => {
        attackTimer.value = { state: 'miss', startTime: new Date().getTime() }
      }, duration)
    } else if (state === 'reset') {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        attackTimer.value = { state: 'init', startTime: new Date().getTime() }
      }, 250)
    } else if (state === 'reset-pause') {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        attackTimer.value = {
          state: 'init-miss',
          startTime: new Date().getTime(),
        }
      }, 250)
    } else if (state === 'miss') {
      timeout = setTimeout(() => {
        attackTimer.value = {
          state: 'init-miss',
          startTime: new Date().getTime(),
        }
      }, 250)
    }
  })
}

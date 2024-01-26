import Phaser from 'phaser'
import { effect } from '@preact/signals-react'
import { backgroundImage, command, enemyHealth, foregroundImage, game, level } from '../signals'
import { playIdle, playIdleEnemy, playMove, playMoveAndAttack1, playMoveAndAttack2, playMoveAndAttack3, setPlayerXPos } from './animationHandlers'
import { setRandomBackground, setRandomforeground } from './worldHandler'
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
    } else if (command.value.type === 'move') {
      playMove(command.value.value)
    }
  })
}

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
  return { bg, fg, gameScene }
}

export const setupGameLevelEffects = () => {
  return effect(() => {
    const gameResources: gameResourcesType | undefined = getGameResources()
    if (!gameResources) return
    const { bg, fg, gameScene } = gameResources
    const { state } = level.value
    
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

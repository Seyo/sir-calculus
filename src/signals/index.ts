import Phaser from 'phaser'
import { effect, signal } from '@preact/signals-react'
import { generateProblem } from '../utils/utils'
import { playHitEnemy } from '../game/animationHandlers'
import { attackDurationType, attackTimerType, commandType, damageType, enemyHealthType, levelType, problemType, resultType } from '../types'

export const command = signal<commandType>({
  type: 'idle',
  value: 0,
})
export const gameEffect = signal<string>('')
export const damage = signal<damageType>({
  state: 'idle',
  hits: [],
})

export const enemyHealth = signal<enemyHealthType>({ total: 100, current: 100 })
export const level = signal<levelType>({ current: 1, state: 'loaded' })

export const problem = signal<problemType>(generateProblem(1))

export const results = signal<resultType[]>([])

export const attackTimer = signal<attackTimerType>({
  state: 'init',
  startTime: new Date().getTime(),
})
export const attackDuration = signal<attackDurationType>({ duration: 10000 })

export const game = signal<Phaser.Game | null>(null)
export const sceneKey = signal<string>('MenuScene')
export const gameScene = signal<Phaser.Types.Scenes.SceneType | null>(null)

export const backgroundImage = signal<Phaser.GameObjects.Image | undefined>(undefined)
export const foregroundImage = signal<Phaser.GameObjects.Image | undefined>(undefined)

// hit effect
effect(() => {
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

//Timer effect
let timeout: NodeJS.Timeout
effect(() => {
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

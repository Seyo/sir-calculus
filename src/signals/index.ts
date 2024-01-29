import Phaser from 'phaser'
import { signal } from '@preact/signals-react'
import { generateProblem } from '../utils/utils'
import { attackDurationType, attackTimerType, commandType, damageType, enemyHealthType, levelType, problemType, resultType } from '../types'
import { setupAttackTimerEffect, setupCommandEffects, setupEnemyHealthEffects, setupGameLevelEffects, setupHitEnemyEffect } from '../game/listeners/gameEffectHandlers'

// Commands sent from UI to game engine
export const command = signal<commandType>({
  type: 'idle',
  value: 0,
})
// Events happening in game engine that effects can listen to, example enemy hit animation
export const gameEffect = signal<string>('')

// Damage dealt to enemy for rendering in UI
export const damage = signal<damageType>({
  state: 'idle',
  hits: [],
})

// State of enemy health
export const enemyHealth = signal<enemyHealthType>({ total: 100, current: 100 })
// Game level state
export const level = signal<levelType>({ current: 1, state: 'loaded' })

// Problem to solve
export const problem = signal<problemType>(generateProblem(1))

// List of results from gameplay
export const results = signal<resultType[]>([])

// Tracking state of attack timer
export const attackTimer = signal<attackTimerType>({
  state: 'init',
  startTime: new Date().getTime(),
})
// Duration of attackTimer
export const attackDuration = signal<attackDurationType>({ duration: 10000 })

// Phaser game object for easy read
export const game = signal<Phaser.Game | null>(null)
// Key for current scene
export const sceneKey = signal<string>('MenuScene')
// Game scene object
export const gameScene = signal<Phaser.Types.Scenes.SceneType | null>(null)

// Reference to Phaser game images
export const backgroundImage = signal<Phaser.GameObjects.Image | undefined>(undefined)
export const foregroundImage = signal<Phaser.GameObjects.Image | undefined>(undefined)

setupCommandEffects()
setupEnemyHealthEffects()
setupGameLevelEffects()
setupHitEnemyEffect()
setupAttackTimerEffect()
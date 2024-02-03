import { signal } from '@preact/signals-react'
import { generateProblem } from '../utils/utils'
import { attackDurationType, attackTimerType, enemyHealthType, levelType, problemType} from '../types'

// State of enemy health
export const enemyHealth = signal<enemyHealthType>({ total: 100, current: 100 })
// Game level state
export const level = signal<levelType>({ current: 1, state: 'loaded' })
// Problem to solve
export const problem = signal<problemType>(generateProblem(1))
// Tracking state of attack timer
export const attackTimer = signal<attackTimerType>({
  state: 'init',
  startTime: new Date().getTime(),
})
// Duration of attackTimer
export const attackDuration = signal<attackDurationType>({ duration: 10000 })

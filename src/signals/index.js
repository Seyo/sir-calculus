import { effect, signal } from "@preact/signals-react";
import { generateProblem } from "../utils/utils";

export const command = signal({ type: 'idle' })
export const gameEffect = signal('')
export const damage = signal({ state: 'idle', hits: [] })

export const enemyHealth = signal({ total: 100, current: 100 })
export const level = signal({ current: 1, state: 'loaded' })

export const problem = signal(generateProblem(1))

export const attackTimer = signal({ state: 'init', startTime: new Date().getTime() })
export const attackDuration = signal({ duration: 10000 })

export const backgroundImage = signal(null)
export const playerSprite = signal(null)
export const enemySprite = signal(null)

export const enemies = signal([])
export const currentEnemy = signal('')

// hit effect
effect(() => {
  if (gameEffect.value === 'hit') {
    const currentHits = damage.peek()
    const currentCommand = command.peek()
    damage.value = { state: 'inProgress', hits: [...currentHits.hits, currentCommand.value] }
    setTimeout(() => { gameEffect.value = '' }, 100)
  }
})

//Timer effect
let timeout = null
effect(() => {
  const { duration } = attackDuration.peek()
  const { state } = attackTimer.value

  if (state === 'running') {

    timeout = setTimeout(() => {

      attackTimer.value = { state: 'miss', startTime: new Date().getTime() }
    }, duration);

  } else if (state === 'reset') {

    clearTimeout(timeout)
    attackTimer.value = { state: 'init', startTime: new Date().getTime() }

  } else if (state === 'miss') {

    timeout = setTimeout(() => {
      attackTimer.value = { state: 'init-miss', startTime: new Date().getTime() }
    }, 250);

  }
})
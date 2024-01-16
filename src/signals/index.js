import { effect, signal } from "@preact/signals-react";
import { generateProblem } from "../utils/utils";

export const command = signal({ type: 'idle' })
export const gameEffect = signal('')
export const damage = signal({ state: 'idle', hits: [] })

export const enemyHealth = signal({ total: 100, current: 100 })
export const level = signal({ current: 1, state: 'loaded' })

export const problem = signal(generateProblem(1))

export const attackTimer = signal({ state: 'init', duration: 10000, startTime: new Date().getTime() })

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
  const { duration } = attackTimer.peek()
  const { state } = attackTimer.value
  if (state === 'running') {
    timeout = setTimeout(() => {
      attackTimer.value = { state: 'miss', duration: duration, startTime: new Date().getTime() }
    }, duration);

  } else if (state === 'reset') {
    clearTimeout(timeout)
    attackTimer.value = { state: 'init', duration: duration, startTime: new Date().getTime() }
  } else if (state === 'miss') {
    timeout = setTimeout(() => {
      attackTimer.value = { state: 'init', duration: duration, startTime: new Date().getTime() }
    }, 250);
  }
})
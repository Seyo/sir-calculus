import { effect, signal } from "@preact/signals-react";
import { generateProblem } from "../utils/utils";

export const command = signal({type:'idle'})
export const gameEffect = signal('')
export const damage = signal({state: 'idle', hits:[]})

export const enemyHealth = signal({total: 20, current: 20})
export const level = signal({current: 1, state: 'loaded'})

export const problem = signal(generateProblem())

export const attackTimer = signal({ state: 'init', duration: 10000, startTime: new Date().getTime() })

effect(() => {
  if(gameEffect.value === 'hit') {
    const currentHits = damage.peek()
    const currentCommand = command.peek()
    damage.value = { state: 'inProgress', hits: [...currentHits.hits, currentCommand.value]}
    setTimeout(() => {gameEffect.value = ''}, 100)
  }
})

let timeout = null
effect(() => {
  console.log('running')
  const {duration} = attackTimer.peek()
  const {state} = attackTimer.value
  if(state === 'running') {
    console.log('starting timer', duration)
    timeout = setTimeout(() => {
      console.log('timer done')
      attackTimer.value = { state: 'init', duration: duration, startTime: new Date().getTime() }
    }, duration);

  } else if(state === 'reset') {
    console.log('clear timeout')
    clearTimeout(timeout)
    attackTimer.value = { state: 'init', duration: duration, startTime: new Date().getTime() }
  }
})
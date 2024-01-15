import { effect, signal } from "@preact/signals-react";
import { generateProblem } from "../utils/utils";

export const command = signal({type:'idle'})
export const gameEffect = signal('')
export const damage = signal({state: 'idle', hits:[]})

export const enemyHealth = signal({total: 20, current: 20})
export const level = signal({current: 1, state: 'loaded'})

export const problem = signal(generateProblem())

effect(() => {
  if(gameEffect.value === 'hit') {
    const currentHits = damage.peek()
    const currentCommand = command.peek()
    damage.value = { state: 'inProgress', hits: [...currentHits.hits, currentCommand.value]}
    setTimeout(() => {gameEffect.value = ''}, 100)
  }
})
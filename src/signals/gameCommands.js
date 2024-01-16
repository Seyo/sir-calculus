import { attackTimer, command, damage, enemyHealth, gameEffect, level, problem } from "."
import { generateProblem } from "../utils/utils"

export const idle = () => {
  command.value = { type: 'idle' }
}

export const attack = (action, dmg) => {
  if (command.value.type === 'idle') {
    resetAttackTimer()
    command.value = { type: action, value: dmg }
  }
}

export const reset = () => {
  command.value = { type: 'reset' }
}

export const hitAttack = () => {
  gameEffect.value = 'hit'
}


export const finishDamage = () => {
  damage.value = {
    state: 'done', hits: damage.value.hits
  }
  const sum = damage.value.hits.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
  const newHealth = enemyHealth.value.current - sum
  enemyHealth.value = {
    total: enemyHealth.value.total,
    current: newHealth > 0 ? newHealth : 0
  }

  if(newHealth <= 0 ) {
    setTimeout(() => {
      level.value = { current: level.value.current + 1, state: 'loading' }
      newProblem()
    }, 1000)

    setTimeout(() => {
      level.value = { current: level.value.current, state: 'loaded' }
      const newTotal = (enemyHealth.value.total * 1.05).toFixed(0)
      enemyHealth.value = {
        total: newTotal,
        current: newTotal
      } }, 2500)
  } else {
    newProblem()
  }
}

export const clearDamage = () => {
  damage.value = { state: 'idle', hits: [] }
}

export const newProblem = () => {
  problem.value = generateProblem(level.peek().current)
}

export const startAttackTimer = () => {
  attackTimer.value = { state: 'running', duration: attackTimer.peek().duration, startTime: new Date().getTime() }
}

export const resetAttackTimer = () => {
  attackTimer.value = { state: 'reset', duration: attackTimer.peek().duration, startTime: new Date().getTime() }
}

export const increaseDuration = () => {
  const dur = attackTimer.peek().duration
  const newDur = dur * 1.1 > 20000 ? 20000 : (dur * 1.1).toFixed(0)
  attackTimer.value = { state: attackTimer.peek().state, duration: newDur, startTime: new Date().getTime() }
}
export const decreaseDuration = () => {
  const dur = attackTimer.peek().duration
  const newDur = (dur - (0.1 * dur)) < 5000 ? 5000 : (dur - (0.1 * dur)).toFixed(0)
  attackTimer.value = { state: attackTimer.peek().state, duration: newDur, startTime: new Date().getTime() }
}
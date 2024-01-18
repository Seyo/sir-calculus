import { attackDuration, attackTimer, command, currentEnemy, damage, enemies, enemyHealth, enemySprite, gameEffect, level, problem } from "."
import { ENEMIES_LIST } from "../game/gameConstants"
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

export const move = (repeats) => {
  if (command.value.type === 'idle') {
    command.value = { type: 'move', value: repeats }
  }
}

export const reset = () => {
  command.value = { type: 'reset' }
}

export const hitAttack = () => {
  gameEffect.value = 'hit'
}

export const changeEnemy = () => {
  const curr = currentEnemy.value
  const indexOfCurrent = enemies.value.findIndex((e) => {
    
    return e.texture.key === curr
  })
  const nextEnemy = enemies.value.length -1 > indexOfCurrent ? indexOfCurrent + 1 : 0
  enemies.value.forEach(e => {
    e.setActive(false).setVisible(false)
  })
  currentEnemy.value = ENEMIES_LIST[nextEnemy]
  enemySprite.value = enemies.value[nextEnemy]
  enemySprite.value.setActive(true).setVisible(true)
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
  attackTimer.value = { state: 'running', startTime: new Date().getTime() }
}

export const resetAttackTimer = () => {
  attackTimer.value = { state: 'reset', startTime: new Date().getTime() }
}

export const increaseDuration = () => {
  const dur = attackDuration.peek().duration
  const newDur = dur * 1.1 > 20000 ? 20000 : (dur * 1.1).toFixed(0)
  attackDuration.value = { duration: newDur}
}
export const decreaseDuration = () => {
  const dur = attackDuration.peek().duration
  const newDur = (dur - (0.1 * dur)) < 5000 ? 5000 : (dur - (0.1 * dur)).toFixed(0)
  attackDuration.value = { duration: newDur }
}
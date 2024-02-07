/**
 * Game commands will trigger different effect,
 * many found within game/gameEffectHandlers
 */
import { attackDuration, attackTimer, command, damage, enemyHealth, game, gameEffect, level, problem, results } from "../signals"
import { ENEMIES_LIST } from "../game/gameConstants"
import { getEnemy } from "../game/gameEntities"
import { resultType } from "../types"
import { generateProblem } from "../utils/utils"

// tell UI and game engine that player is idle
export const idle = () => {
  if (command.peek().type !== 'idle') {
    command.value = { type: 'idle', value: 0 }
  }
}
export const idle2 = () => {
  if (command.peek().type !== 'idle') {
    command.value = { type: 'idle2', value: 0 }
  }
}
export const idle3 = () => {
  if (command.peek().type !== 'idle') {
    command.value = { type: 'idle3', value: 0 }
  }
}
export const idle4 = () => {
  if (command.peek().type !== 'idle') {
    command.value = { type: 'idle4', value: 0 }
  }
}
export const idle5 = () => {
  if (command.peek().type !== 'idle') {
    command.value = { type: 'idle5', value: 0 }
  }
}
export const idle6 = () => {
  if (command.peek().type !== 'idle') {
    command.value = { type: 'idle6', value: 0 }
  }
}
export const idle7 = () => {
  if (command.peek().type !== 'idle') {
    command.value = { type: 'idle7', value: 0 }
  }
}
export const idle8 = () => {
  if (command.peek().type !== 'idle') {
    command.value = { type: 'idle8', value: 0 }
  }
}

// tell game engine to run attack sequence
export const attack = (action: string, dmg: number) => {
  if (command.value.type === 'idle') {
    resetAttackTimer(false)
    command.value = { type: action, value: dmg }
  }
}

// tell game engine to move player for number of iterations
export const move = (repeats: number) => {
  if (command.value.type === 'idle') {
    command.value = { type: 'move', value: repeats }
  }
}

// tell game engine to reset player
export const reset = () => {
  command.value = { type: 'reset', value: 0 }
}

// Trigger game effect "hit" allowing for listeners to react
export const hitAttack = () => {
  gameEffect.value = 'hit'
}

// replace image for enemy sprite
export const changeEnemy = () => {
  const scene = game.peek()?.scene
  if (!scene) return
  const gameScene = scene.getScene('GameScene');
  const e = getEnemy()
  if (!e) return

  //Find next enemy resource
  const indexOfCurrent = ENEMIES_LIST.findIndex((en) => {
    return en === e.texture.key
  })
  const nextEnemy = ENEMIES_LIST.length - 1 > indexOfCurrent ? indexOfCurrent + 1 : 0
  const nextEnemyTextureKey = ENEMIES_LIST[nextEnemy]

  // remove old animations
  e.anims.remove('hit_enemy')
  e.anims.remove('idle_enemy')

  // add new texture and animations
  e.setTexture(nextEnemyTextureKey)
  e.anims.create({
    key: 'hit_enemy',
    frames: gameScene.anims.generateFrameNames(nextEnemyTextureKey, { frames: [1, 2, 3, 4] }),
    frameRate: 12,
    repeat: 0
  });
  e.anims.create({
    key: 'idle_enemy',
    frames: gameScene.anims.generateFrameNames(nextEnemyTextureKey, { frames: [0] }),
    frameRate: 12,
    repeat: -1
  });

}

// Finalize damage and load new problem or new level
export const finishDamage = () => {
  const dmg = {
    state: 'done', hits: damage.peek().hits
  }
  damage.value = dmg
  const sum = dmg.hits.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);
  const newHealth = enemyHealth.peek().current - sum
  enemyHealth.value = {
    total: enemyHealth.value.total,
    current: newHealth > 0 ? newHealth : 0
  }

  if (newHealth <= 0) {
    setTimeout(() => {
      level.value = { current: level.value.current + 1, state: 'loading' }
      newProblem()
    }, 1000)

    setTimeout(() => {
      level.value = { current: level.value.current, state: 'loaded' }
      const newTotal = parseInt((enemyHealth.value.total * 1.05).toFixed(0))
      enemyHealth.value = {
        total: newTotal,
        current: newTotal
      }
    }, 2500)
  } else {
    newProblem()
  }
}

// Clear current damage UI
export const clearDamage = () => {
  damage.value = { state: 'idle', hits: [] }
}

// Generate new problem based on level
export const newProblem = () => {
  problem.value = generateProblem(level.peek().current)
}

// Store result from problem solving
export const storeResult = (result: resultType) => {
  results.value = [...results.peek(), result]
}

// Start atack timer
export const startAttackTimer = () => {
  attackTimer.value = { state: 'running', startTime: new Date().getTime() }
}

// Reset attack timer to beginning and either restart it or pause it
export const resetAttackTimer = (pause: boolean | undefined) => {
  if (pause) {
    attackTimer.value = { state: 'reset-pause', startTime: new Date().getTime() }
  } else {
    attackTimer.value = { state: 'reset', startTime: new Date().getTime() }
  }
}

// Increase the duration for attack timer making it easier
export const increaseDuration = () => {
  const dur = attackDuration.peek().duration
  const newDur = dur * 1.1 > 20000 ? 20000 : parseInt((dur * 1.1).toFixed(0))
  attackDuration.value = { duration: newDur }
}

// Decrease the duration for the attack timer making it harder
export const decreaseDuration = () => {
  const dur = attackDuration.peek().duration
  const newDur = (dur - (0.1 * dur)) < 5000 ? 5000 : parseInt((dur - (0.1 * dur)).toFixed(0))
  attackDuration.value = { duration: newDur }
}
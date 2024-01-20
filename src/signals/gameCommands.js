import { attackDuration, attackTimer, command, damage, enemyHealth, game, gameEffect, gameScene, level, problem, results, sceneKey } from "."
import { ENEMIES_LIST } from "../game/gameConstants"
import { generateProblem } from "../utils/utils"

export const toggleMenu = () => {

  const scene = game.peek()?.scene

  const isPaused = scene.isPaused('MenuScene');
  if (false === isPaused) {
    scene.pause('MenuScene');
  } else {
    scene.resume('MenuScene');
    sceneKey.value = 'MenuScene'
  }

  const isNull = scene.getScene('GameScene');
  if (null === isNull) {
    scene.add('GameScene', gameScene.peek(), true);
    sceneKey.value = 'GameScene'
  } else {
    scene.remove('GameScene');
  }

}


export const idle = () => {
  if(command.peek().type !== 'idle') {
    command.value = { type: 'idle' }
  }
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
  const scene = game.peek()?.scene
  const gameScene = scene.getScene('GameScene');
  const children = gameScene.children.getChildren()
  const e = children.find(c => c.name === 'enemy')
  const indexOfCurrent = ENEMIES_LIST.findIndex((en) => {
    return en === e.texture.key
  })
  const nextEnemy = ENEMIES_LIST.length -1 > indexOfCurrent ? indexOfCurrent + 1 : 0
  const nextEnemyTextureKey = ENEMIES_LIST[nextEnemy]

  e.anims.remove('hit_enemy')
  e.anims.remove('idle_enemy')

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

export const storeResult = (result) => {
  results.value = [...results.peek(), result]
}

export const startAttackTimer = () => {
  attackTimer.value = { state: 'running', startTime: new Date().getTime() }
}

export const resetAttackTimer = (pause) => {
  if(pause) {
    attackTimer.value = { state: 'reset-pause', startTime: new Date().getTime() }
  } else {
    attackTimer.value = { state: 'reset', startTime: new Date().getTime() }
  }
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
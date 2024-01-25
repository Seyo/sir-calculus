import { game } from '../signals'

const getEnemy = () => {
  const scene = game.peek()?.scene
  const gameScene = scene.getScene('GameScene')
  const children = gameScene.children.getChildren()
  const e = children.find((c) => c.name === 'enemy')
  return e
}

const getPlayer = () => {
  const scene = game.peek()?.scene
  const gameScene = scene.getScene('GameScene')
  const children = gameScene.children.getChildren()
  const e = children.find((c) => c.name === 'player')
  return e
}


export const playIdle = () => {
  const p = getPlayer()
  if (p?.anims.currentAnim.key !== 'idle') {
    p.play({ key: 'idle', repeat: -1 })
    p.chain()
  }
}

export const playReturn = () => {
  const p = getPlayer()
  return p.chain([{ key: 'jumpback', repeat: 0 }])
}

export const playMove = (repeat = 0) => {
  const p = getPlayer()
  p.play({ key: 'move', repeat: repeat })
  p.chain({ key: 'idle', repeat: -1 })
}

export const playMoveAndAttack1 = () => {
  const p = getPlayer()
  p.play({ key: 'move', repeat: 1 })
  p.chain('attack1')
  playReturn(true)
}
export const playMoveAndAttack2 = () => {
  const p = getPlayer()
  p.play({ key: 'move', repeat: 1 })
  p.chain(['attack1','attack2'])
  playReturn(true)
}
export const playMoveAndAttack3 = () => {
  const p = getPlayer()
  p.play({ key: 'move', repeat: 1 })
  p.chain(['attack1', 'attack2', 'attack3'])
  playReturn(true)
}

export const setPlayerXPos = (xPos) => {
  const p = getPlayer()
  p.x = xPos
}
export const changePlayerXPos = (xPosDelta) => {
  const p = getPlayer()
  p.x += xPosDelta
}

export const playHitEnemy = () => {
  const e = getEnemy()
  e.play({ key: 'hit_enemy', repeat: 0 })
  e.chain({ key: 'idle_enemy', repeat: -1 })
}
export const playIdleEnemy = () => {
  const e = getEnemy()
  e.play({ key: 'idle_enemy', repeat: -1 })
}



import { getEnemy, getPlayer } from "./gameEntities"



export const playIdle = () => {
  const p = getPlayer()
  if(!p) return
  if (p.anims.currentAnim?.key !== 'idle') {
    p.play({ key: 'idle', repeat: -1 })
    p.chain()
  }
}

export const playReturn = () => {
  const p = getPlayer()
  if (!p) return
  return p.chain([{ key: 'jumpback', repeat: 0 }])
}

export const playMove = (repeat = 0) => {
  const p = getPlayer()
  if (!p) return;
  p.play({ key: 'move', repeat: repeat })
  p.chain({ key: 'idle', repeat: -1 })
}

export const playMoveAndAttack1 = () => {
  const p = getPlayer()
  if (!p) return;
  p.play({ key: 'move', repeat: 1 })
  p.chain('attack1')
  playReturn()
}
export const playMoveAndAttack2 = () => {
  const p = getPlayer()
  if (!p) return;
  p.play({ key: 'move', repeat: 1 })
  p.chain(['attack1','attack2'])
  playReturn()
}
export const playMoveAndAttack3 = () => {
  const p = getPlayer()
  if (!p) return;
  p.play({ key: 'move', repeat: 1 })
  p.chain(['attack1', 'attack2', 'attack3'])
  playReturn()
}

export const setPlayerXPos = (xPos: number) => {
  const p = getPlayer()
  if (!p) return;
  p.x = xPos
}
export const changePlayerXPos = (xPosDelta: number) => {
  const p = getPlayer()
  if (!p) return;
  p.x += xPosDelta
}

export const playHitEnemy = () => {
  const e = getEnemy()
  if (!e) return;
  e.play({ key: 'hit_enemy', repeat: 0 })
  e.chain({ key: 'idle_enemy', repeat: -1 })
}
export const playIdleEnemy = () => {
  const e = getEnemy()
  if (!e) return;
  e.play({ key: 'idle_enemy', repeat: -1 })
}



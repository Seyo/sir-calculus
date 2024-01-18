import Phaser from 'phaser'
import { finishDamage, hitAttack, idle } from '../signals/gameCommands'
import { ATTACK_DISTANCE, JUMP_FRAME_COUNT, MOVE_FRAME_COUNT, PLAYER_START_X } from './gameConstants'
import { enemySprite, playerSprite } from '../signals'

export const playIdle = () => {
  const p = playerSprite.value
  if (p.anims.currentAnim.key !== 'idle') {
    p.play({ key: 'idle', repeat: -1 })
    p.chain()
  }
}
export const playReset = () => {
  playReturn()
}

export const playReturn = (chain) => {
  const p = playerSprite.value
  if (chain) {
    return p.chain([{ key: 'jumpback', repeat: 0 }])
  } else {
    return p.play({ key: 'jumpback', repeat: 0 })
  }
}

export const playMove = (repeat = 0) => {
  const p = playerSprite.value
  p.play({ key: 'move', repeat: repeat })
  p.chain({ key: 'idle', repeat: -1 })
}

export const playMoveAndAttack1 = () => {
  const p = playerSprite.value
  p.play({ key: 'move', repeat: 1 })
  p.chain('attack1')
  playReturn(true)
}
export const playMoveAndAttack2 = () => {
  const p = playerSprite.value
  p.play({ key: 'move', repeat: 1 })
  p.chain(['attack1','attack2'])
  playReturn(true)
}
export const playMoveAndAttack3 = () => {
  const p = playerSprite.value
  p.play({ key: 'move', repeat: 2 })
  p.chain(['attack1', 'attack2', 'attack3'])
  playReturn(true)
}


export const playHitEnemy = () => {
  const e = enemySprite.value
  e.play({ key: 'hit_enemy', repeat: 0 })
  e.chain({ key: 'idle_enemy', repeat: -1 })
}
export const playIdleEnemy = () => {
  const e = enemySprite.value
  e.play({ key: 'idle_enemy', repeat: -1 })
}

export const registerAnimationListeners = () => {
  const p = playerSprite.value
  p.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function (anim) {
    if (anim.key === 'jumpback') {
      const jumpBackFrameDistance = ATTACK_DISTANCE / JUMP_FRAME_COUNT
      p.jumpBackFrameDistance = jumpBackFrameDistance
      idle()
    }
    if (anim.key === 'move') {
      const frameDistance = ATTACK_DISTANCE / MOVE_FRAME_COUNT
      p.x += frameDistance
    }
  })
  p.on(Phaser.Animations.Events.ANIMATION_START, function (anim) {
    if (anim.key === 'jumpback') {
      finishDamage()
      //calculate distance to jump
      const distanceFromStart = p.x - PLAYER_START_X
      const jumpBackFrameDistance = distanceFromStart / JUMP_FRAME_COUNT
      p.jumpBackFrameDistance = jumpBackFrameDistance
    }
    if (anim.key === 'idle') {
      idle()
    }

  })

  p.on(Phaser.Animations.Events.ANIMATION_UPDATE, function (anim) {
    if (anim.key === 'move') {
      const frameDistance = ATTACK_DISTANCE / MOVE_FRAME_COUNT
      p.x += frameDistance
    }
    if (anim.key === 'jumpback') {
      const frame = p.anims.currentFrame.index
      if (frame >= 5 && frame < 8) {
        p.x -= p.jumpBackFrameDistance
      }
    }
    if (anim.key === 'attack1') {
      const frame = p.anims.currentFrame.index
      if (frame === 5) {
        hitAttack()
        playHitEnemy()
      }
    }
    if (anim.key === 'attack2') {
      const frame = p.anims.currentFrame.index
      if (frame === 6) {
        hitAttack()
        playHitEnemy()
      }
    }
    if (anim.key === 'attack3') {
      const frame = p.anims.currentFrame.index
      if (frame === 8) {
        hitAttack()
        playHitEnemy()
      }
    }
  })
}

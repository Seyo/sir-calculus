import Phaser from 'phaser'
import { finishDamage, hitAttack, idle } from '../signals/gameCommands'
import { ATTACK_DISTANCE, JUMP_FRAME_COUNT, MOVE_FRAME_COUNT, PLAYER_START_X } from './gameConstants'

export const playIdle = (p) => {
  if (p.anims.currentAnim.key !== 'idle') {
    p.play({ key: 'idle', repeat: -1 })
    p.chain()
  }
}
export const playReset = (p) => {
  playReturn(p)
}

export const playReturn = (p, chain) => {
  if (chain) {
    return p.chain([{ key: 'jumpback', repeat: 0 }])
  } else {
    return p.play({ key: 'jumpback', repeat: 0 })
  }
}

export const playMoveAndAttack1 = (p) => {
  p.play({ key: 'move', repeat: 0 })
  p.chain('attack1')
  playReturn(p, true)
}
export const playMoveAndAttack2 = (p) => {
  p.play({ key: 'move', repeat: 0 })
  p.chain('attack2')
  playReturn(p, true)
}
export const playMoveAndAttack3 = (p) => {
  p.play({ key: 'move', repeat: 0 })
  p.chain(['attack1', 'attack2'])
  playReturn(p, true)
}
export const playMoveAndAttack4 = (p) => {
  p.play({ key: 'move', repeat: 0 })
  p.chain('attack3')
  playReturn(p, true)
}

export const playHitEnemy = (e) => {
  e.play({ key: 'hit_enemy', repeat: 0 })
}
export const playIdleEnemy = (e) => {
  e.play({ key: 'idle_enemy', repeat: -1 })
}

export const registerAnimationListeners = (player, enemy) => {
  player.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function (anim) {
    if (anim.key === 'jumpback') {
      const jumpBackFrameDistance = ATTACK_DISTANCE / JUMP_FRAME_COUNT
      player.jumpBackFrameDistance = jumpBackFrameDistance
      idle()
    }
  })

  player.on(Phaser.Animations.Events.ANIMATION_START, function (anim) {
    if (anim.key === 'jumpback') {
      finishDamage()
      //calculate distance to jump
      const distanceFromStart = player.x - PLAYER_START_X
      const jumpBackFrameDistance = distanceFromStart / JUMP_FRAME_COUNT
      player.jumpBackFrameDistance = jumpBackFrameDistance
    }
  })

  player.on(Phaser.Animations.Events.ANIMATION_UPDATE, function (anim) {
    if (anim.key === 'move') {
      const frameDistance = ATTACK_DISTANCE / MOVE_FRAME_COUNT
      player.x += frameDistance
    }
    if (anim.key === 'jumpback') {
      const frame = player.anims.currentFrame.index
      if (frame >= 5 && frame < 8) {
        player.x -= player.jumpBackFrameDistance
      }
    }
    if (anim.key === 'attack1') {
      const frame = player.anims.currentFrame.index
      if (frame === 5) {
        hitAttack()
        enemy.play({ key: 'hit_enemy', repeat: 0 })
        enemy.chain({ key: 'idle_enemy', repeat: -1 })
      }
    }
    if (anim.key === 'attack2') {
      const frame = player.anims.currentFrame.index
      if (frame === 5 || frame === 9) {
        hitAttack()
        enemy.play({ key: 'hit_enemy', repeat: 0 })
        enemy.chain({ key: 'idle_enemy', repeat: -1 })
      }
    }
    if (anim.key === 'attack3') {
      const frame = player.anims.currentFrame.index
      if (frame === 5 || frame === 9 || frame === 19) {
        hitAttack()
        enemy.play({ key: 'hit_enemy', repeat: 0 })
        enemy.chain({ key: 'idle_enemy', repeat: -1 })
      }
    }
  })
}

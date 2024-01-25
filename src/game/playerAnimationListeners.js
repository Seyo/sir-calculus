import Phaser from 'phaser'
import { finishDamage, hitAttack, idle } from '../signals/gameCommands'
import { ATTACK_DISTANCE, JUMP_FRAME_COUNT, MOVE_FRAME_COUNT, PLAYER_START_X } from './gameConstants'
import { changePlayerXPos } from './animationHandlers'

const handleUpdateMove = () => {
  const frameDistance = ATTACK_DISTANCE / MOVE_FRAME_COUNT
  changePlayerXPos(frameDistance)
}

const handleUpdateJumpback = (p) => {
  const frame = p.anims.currentFrame.index
  if (frame >= 5 && frame < 8) {
    p.x -= p.jumpBackFrameDistance
  }
}

const handleUpdateAttack = (p) => {
  const hitFrameLookup = {
    attack1: 5,
    attack2: 6,
    attack3: 8
  }
  const frame = p.anims.currentFrame.index
  const animationKey = p.anims.currentAnim.key
  if (frame === hitFrameLookup[animationKey]) {
    hitAttack()
  }

}

const registerPlayerAnimationStart = (p) => {
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
}

const registerPlayerAnimationComplete = (p) => {
  p.on(Phaser.Animations.Events.ANIMATION_COMPLETE, function (anim) {
    if (anim.key === 'jumpback') {
      const jumpBackFrameDistance = ATTACK_DISTANCE / JUMP_FRAME_COUNT
      p.jumpBackFrameDistance = jumpBackFrameDistance
      idle()
    }
    if (anim.key === 'move') {
      const frameDistance = ATTACK_DISTANCE / MOVE_FRAME_COUNT
      changePlayerXPos(frameDistance)
    }
  })
}


const registerAnimationUpdate = (p) => {
  p.on(Phaser.Animations.Events.ANIMATION_UPDATE, function (anim) {
    switch (anim.key) {
      case 'move':
        handleUpdateMove()
        break
      case 'jumpback':
        handleUpdateJumpback(p)
        break
      case 'attack1':
      case 'attack2':
      case 'attack3':
        handleUpdateAttack(p)
        break
      default:
        break
    }
  })
}

export const registerAnimationListeners = (p) => {
  registerPlayerAnimationStart(p)
  registerPlayerAnimationComplete(p)
  registerAnimationUpdate(p)
}

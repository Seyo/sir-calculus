import Phaser from 'phaser'
import { finishDamage, hitAttack, idle } from '../../controllers/gameCommands.js'
import { ATTACK_DISTANCE, JUMP_FRAME_COUNT, MOVE_FRAME_COUNT, PLAYER_START_X } from '../gameConstants.js'
import { changePlayerXPos } from '../animationHandlers.js'
import { customSpriteType } from '../../types/index.js'

const handleUpdateMove = () => {
  const frameDistance = ATTACK_DISTANCE / MOVE_FRAME_COUNT
  changePlayerXPos(frameDistance)
}

const handleUpdateJumpback = (p: customSpriteType) => {
  const frame = p.anims.currentFrame?.index || -1
  if (frame >= 5 && frame < 8) {
    p.x -= p.jumpBackFrameDistance
  }
}

const handleUpdateAttack = (p: Phaser.GameObjects.Sprite) => {
  const hitFrameLookup: { [key: string]: number} = {
    'attack1': 5,
    'attack2': 6,
    'attack3': 8
  }
  const frame: number = p.anims.currentFrame?.index || -1
  const animationKey: string = p.anims.currentAnim?.key || 'not-set'
  const lookUpValue: number = hitFrameLookup[animationKey]
  if (frame === lookUpValue) {
    hitAttack()
  }

}

const registerPlayerAnimationStart = (p: customSpriteType) => {
  p.on(
    Phaser.Animations.Events.ANIMATION_START,
    function (anim: Phaser.Types.Animations.Animation) {
      if (anim.key === "jumpback") {
        finishDamage();
        //calculate distance to jump
        const distanceFromStart = p.x - PLAYER_START_X;
        const jumpBackFrameDistance = distanceFromStart / JUMP_FRAME_COUNT;
        p.jumpBackFrameDistance = jumpBackFrameDistance;
      }
      if (anim.key === "idle") {
        idle();
      }
    }
  );
};

const registerPlayerAnimationComplete = (p: customSpriteType) => {
  p.on(
    Phaser.Animations.Events.ANIMATION_COMPLETE,
    function (anim: Phaser.Types.Animations.Animation) {
      if (anim.key === "jumpback") {
        const jumpBackFrameDistance = ATTACK_DISTANCE / JUMP_FRAME_COUNT;
        p.jumpBackFrameDistance = jumpBackFrameDistance;
        idle();
      }
      if (anim.key === "move") {
        const frameDistance = ATTACK_DISTANCE / MOVE_FRAME_COUNT;
        changePlayerXPos(frameDistance);
      }
    }
  );
};


const registerAnimationUpdate = (p: customSpriteType) => {
  p.on(
    Phaser.Animations.Events.ANIMATION_UPDATE,
    function (anim: Phaser.Types.Animations.Animation) {
      switch (anim.key) {
        case "move":
          handleUpdateMove();
          break;
        case "jumpback":
          handleUpdateJumpback(p);
          break;
        case "attack1":
        case "attack2":
        case "attack3":
          handleUpdateAttack(p);
          break;
        default:
          break;
      }
    }
  );
};

export const registerAnimationListeners = (p: customSpriteType) => {
  registerPlayerAnimationStart(p);
  registerPlayerAnimationComplete(p);
  registerAnimationUpdate(p);
};

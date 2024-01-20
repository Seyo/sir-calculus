import Phaser from 'phaser'
import { currentEnemy, enemies, enemySprite, playerSprite } from "../signals"
import { registerAnimationListeners } from "./animationHandlers"
import { ENEMIES_LIST, PLAYER_START_X, SCALE } from "./gameConstants"

export const createActors = (scene) => {

  let firstEnemy = null
  const enemiesList = ENEMIES_LIST
  enemiesList.map((e, idx) => {

    const enemySpriteLocal = new Phaser.GameObjects.Sprite(scene, 375, 316, e);
    scene.add.existing(enemySpriteLocal)
    enemySpriteLocal.setScale(SCALE)
    enemySpriteLocal.anims.create({
      key: 'hit_enemy',
      frames: scene.anims.generateFrameNames(e, { frames: [1, 2, 3, 4] }),
      frameRate: 12,
      repeat: 0
    });
    enemySpriteLocal.anims.create({
      key: 'idle_enemy',
      frames: scene.anims.generateFrameNames(e, { frames: [0] }),
      frameRate: 12,
      repeat: -1
    });
    enemySpriteLocal.setActive(false).setVisible(false)
    enemies.value = [...enemies.value, enemySpriteLocal]
    if(idx === 0) {
      firstEnemy = enemySpriteLocal
    }
  })

  playerSprite.value = scene.add.sprite(PLAYER_START_X, 328, 'player')
  playerSprite.value.anims.createFromAseprite('player')
  playerSprite.value.setScale(SCALE)

  enemySprite.value = enemies.value[0]
  currentEnemy.value = enemiesList[0]
  firstEnemy.setActive(true).setVisible(true)
  
  registerAnimationListeners()

  playerSprite.value.play({ key: 'idle', repeat: -1 })
  firstEnemy.playAfterDelay({ key: 'idle_enemy', repeat: -1 }, 200)


  return {  }
}

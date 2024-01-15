import { useEffect } from 'react'
import Phaser from 'phaser'
import { gameConfig } from '../game/gameConfig'
import { useSignal } from '@preact/signals-react'
import { buildWorld } from '../game/worldHandler'
import { setupCommandEffects, setupEnemyHealthEffects, setupGameLevelEffects } from '../game/gameEffectHandlers'
import { createActors } from '../game/actorHandlers'

function generatePhaserCreate(gameCommandsEffect, enemyHealthEffect, gameLevelEffect) {
  return function () {
    const { bg } = buildWorld(this)
    const { player, enemy } = createActors(this)

    //listen to signals from React component and internal
    gameCommandsEffect.value = setupCommandEffects(player)
    enemyHealthEffect.value = setupEnemyHealthEffects(enemy)
    gameLevelEffect.value = setupGameLevelEffects(this, bg, enemy)
  }
}

export const Game = () => {
  const game = useSignal(null)
  const gameCommandsEffect = useSignal(null)
  const enemyHealthEffect = useSignal(null)
  const gameLevelEffect = useSignal(null)
  useEffect(() => {
    if (!game.value) {
      const create = generatePhaserCreate(gameCommandsEffect, enemyHealthEffect, gameLevelEffect)
      game.value = new Phaser.Game(gameConfig(create))
    }
    return () => {
      game.value.destroy(true)
      game.value = null
      gameCommandsEffect.value && gameCommandsEffect.value()
      enemyHealthEffect.value && enemyHealthEffect.value()
      gameLevelEffect.value && gameLevelEffect.value()
    }
  }, [])

  return <div id="phaser-game" />
}

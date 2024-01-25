import { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { gameConfig } from '../game/gameConfig'
import { buildWorld } from '../game/worldHandler'
import { setupCommandEffects, setupEnemyHealthEffects, setupGameLevelEffects } from '../game/gameEffectHandlers'
import { createActors } from '../game/actorHandlers'
import { game } from '../signals'
import { effectUnsubscribeType } from '../types'

function generatePhaserCreate(
  gameCommandsEffect: effectUnsubscribeType | undefined,
  enemyHealthEffect: effectUnsubscribeType | undefined,
  gameLevelEffect: effectUnsubscribeType | undefined,
) {
  return function (scene: Phaser.Types.Scenes.SceneType) {
    buildWorld(scene);
    createActors(scene);

    //listen to signals from React component and internal
    gameCommandsEffect && gameCommandsEffect();
    enemyHealthEffect && enemyHealthEffect();
    gameLevelEffect && gameLevelEffect();

    gameCommandsEffect = setupCommandEffects();
    enemyHealthEffect = setupEnemyHealthEffects();
    gameLevelEffect = setupGameLevelEffects();
  };
}

export const Game = () => {
  //const game = useSignal(null)
  const gameCommandsEffect = useRef<effectUnsubscribeType>();
  const enemyHealthEffect = useRef<effectUnsubscribeType>();
  const gameLevelEffect = useRef<effectUnsubscribeType>();
  useEffect(() => {
    if (!game.value) {
      const create = generatePhaserCreate(gameCommandsEffect.current, enemyHealthEffect.current, gameLevelEffect.current)
      game.value = new Phaser.Game(gameConfig(create))
    }
    return () => {
      game.value?.destroy(true)
      game.value = null
      gameCommandsEffect.current && gameCommandsEffect.current();
      enemyHealthEffect.current && enemyHealthEffect.current();
      gameLevelEffect.current && gameLevelEffect.current();
    }
  }, [])

  return <div id="phaser-game" />
}

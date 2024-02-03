import { setupAttackTimerEffect, setupCommandEffects, setupEnemyHealthEffects, setupGameLevelEffects, setupHitEnemyEffect } from '../game/listeners/gameEffectHandlers'

export * from './navigationSignals'
export * from './gameActionSignals'
export * from './gameVisualsSignal'
export * from './gameLogicSignals'
export * from './gameAssetSignals'
export * from './gameDataSignals'

setupCommandEffects()
setupEnemyHealthEffects()
setupGameLevelEffects()
setupHitEnemyEffect()
setupAttackTimerEffect()

import Phaser from 'phaser'
import { useEffect } from 'react'
import { gameConfig } from '../game/setup/gameConfig'
import { game } from '../signals'

export const Game = () => {
  useEffect(() => {
    if (!game.value) {
      const conf = gameConfig()
      game.value = new Phaser.Game(conf)
    }
    return () => {
      game.value?.destroy(true)
      game.value = null
    }
  }, [])
  return <div id="phaser-game" />
}

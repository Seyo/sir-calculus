import { game, gameScene, sceneKey } from "../signals"

export const toggleMenu = () => {
  const g = game.peek()
  const gameScenePeek = gameScene.peek()
  if (!(g && gameScenePeek)) return
  const scene = game.peek()?.scene
  if (!scene) return

  const isPaused = scene.isPaused('MenuScene')
  if (false === isPaused) {
    scene.pause('MenuScene')
  } else {
    scene.resume('MenuScene')
    sceneKey.value = 'MenuScene'
  }

  const isNull = scene.getScene('GameScene')
  if (null === isNull) {
    scene.add('GameScene', gameScenePeek, true)
    sceneKey.value = 'GameScene'
  } else {
    scene.remove('GameScene')
  }
}




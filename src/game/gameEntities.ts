import Phaser from 'phaser'
import { game } from '../signals'

export const getEnemy = (): Phaser.GameObjects.Sprite | undefined => {
  const g = game.peek()
  if (!g) return undefined
  const scene = g.scene
  const gameScene = scene.getScene('GameScene')
  const children = gameScene.children.getChildren()
  const e = children.find((c) => c.name === 'enemy')
  if (e instanceof Phaser.GameObjects.Sprite) {
    return e
  }
  return undefined
}

export const getPlayer = (): Phaser.GameObjects.Sprite | undefined => {
  const g = game.peek()
  if (!g) return undefined
  const scene = g.scene
  const gameScene = scene.getScene('GameScene')
  const children = gameScene.children.getChildren()
  const e = children.find((c) => c.name === 'player')
  if (e instanceof Phaser.GameObjects.Sprite) {
    return e
  }
  return undefined
}

import Phaser from 'phaser'
import { signal } from '@preact/signals-react'

// Phaser game object for easy read
export const game = signal<Phaser.Game | null>(null)
// Game scene object
export const gameScene = signal<Phaser.Types.Scenes.SceneType | null>(null)

// Reference to Phaser game images
export const backgroundImage = signal<Phaser.GameObjects.Image | undefined>(undefined)
export const foregroundImage = signal<Phaser.GameObjects.Image | undefined>(undefined)

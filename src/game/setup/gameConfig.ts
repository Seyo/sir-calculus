import Phaser from 'phaser'
import { gameScene } from '../../signals';
import { MenuScene } from '../scenes/MenuScene';
import { GameScene } from '../scenes/GameScene';

export const gameConfig = (): Phaser.Types.Core.GameConfig => {
  gameScene.value = GameScene;
  return {
    type: Phaser.AUTO,
    width: 1024,
    height: 800,
    parent: "phaser-game",
    pixelArt: true,
    scene: [MenuScene],
  };
};

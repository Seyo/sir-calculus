import React, { useEffect } from 'react';
import Phaser from 'phaser';
import { command, enemyHealth, level } from '../signals';
import { effect } from '@preact/signals';
import { playHitEnemy, playIdle, playIdleEnemy, playMoveAndAttack1, playMoveAndAttack2, playMoveAndAttack3, playMoveAndAttack4, playReset, registerAnimationListeners } from '../game/animationHandlers';
import { PLAYER_START_X, SCALE } from '../game/gameConstants'
import { getRandomInt } from '../utils/utils';
import { newProblem } from '../signals/gameCommands';


const backgroundImages = [
'/backgrounds/bg_00002_.png',
'/backgrounds/bg_00003_.png',
'/backgrounds/bg_00004_.png',
'/backgrounds/bg_00005_.png',
'/backgrounds/bg_00006_.png',
'/backgrounds/bg_00007_.png',
'/backgrounds/bg_00008_.png',
'/backgrounds/bg_00009_.png',
'/backgrounds/bg_00010_.png',
'/backgrounds/bg_00011_.png',
'/backgrounds/bg_00013_.png',
'/backgrounds/bg_00014_.png',
'/backgrounds/bg_00015_.png',
'/backgrounds/bg_00016_.png',
'/backgrounds/bg_00017_.png',
'/backgrounds/bg_00018_.png',
'/backgrounds/bg_00019_.png',
'/backgrounds/bg_00020_.png',
'/backgrounds/bg_00021_.png',
'/backgrounds/bg_00022_.png',
'/backgrounds/bg_00023_.png',
'/backgrounds/bg_00024_.png',
'/backgrounds/bg_00025_.png',
'/backgrounds/bg_00026_.png',
'/backgrounds/bg_00027_.png',
'/backgrounds/bg_00028_.png',
'/backgrounds/bg_00029_.png',
'/backgrounds/bg_00030_.png',
'/backgrounds/bg_00031_.png',
'/backgrounds/bg_00032_.png',
'/backgrounds/bg_00033_.png',
'/backgrounds/bg_00034_.png',
'/backgrounds/bg_00036_.png',
'/backgrounds/bg_00037_.png',
'/backgrounds/bg_00038_.png',
'/backgrounds/bg_00039_.png',
'/backgrounds/bg_00040_.png',
]
let game;
let gameSignalEffect;
let gameLevelEffect;
let enemyHealthEffect;

const getBgName = (filepath) => filepath.replace('/backgrounds/', '').replace('_.png', '')

function preload() {
  this.load.aseprite('player', '/sircalculus.png', '/sircalculus.json');
  this.load.aseprite('calculator', '/calculator.png', '/calculator.json');
  this.load.image('background', './backgrounds/bg_3.png');
  this.load.image('background2', './backgrounds/bg_2.png');
  backgroundImages.forEach(bg => {
    const bgName = getBgName(bg)
    this.load.image(bgName, bg);
  })
}

function create() {
  const bg = this.add.image(0, 0, 'background');
  bg.setOrigin(0, 0);
  const r1 = this.add.rectangle(0, 400, 1024, 400, 0x000000);
  r1.setOrigin(0, 0);

  this.anims.createFromAseprite('calculator');
  const enemy = this.add.sprite(375, 316, 'calculator')

  this.anims.createFromAseprite('player');
  const player = this.add.sprite(PLAYER_START_X, 304, 'player')

  player.setScale(SCALE)
  enemy.setScale(SCALE/2, SCALE/2)

  registerAnimationListeners(player, enemy)
  player.play({ key: 'idle', repeat: -1 })
  enemy.playAfterDelay({ key: 'idle_enemy', repeat: -1 }, 200)

  //listen to signals from React component and internal
  gameSignalEffect = effect(() => {
    if (command.value.type === 'idle') {
      playIdle(player)
    } else if (command.value.type === 'attack1') {
      playMoveAndAttack1(player)
    } else if (command.value.type === 'attack2') {
      playMoveAndAttack2(player)
    } else if (command.value.type === 'attack3') {
      playMoveAndAttack3(player)
    } else if (command.value.type === 'attack4') {
      playMoveAndAttack4(player)
    } else if (command.value.type === 'reset') {
      playReset(player)
    }
  })
  enemyHealthEffect = effect(() => {
    if(enemyHealth.value.current === 0) {
      playHitEnemy(enemy)
      
    }
  })

  gameLevelEffect = effect(() => {
    if(level.value.state === 'loading') {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.cameras.main.once(
        Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
        () => {
          const bgIndex = getRandomInt(0, backgroundImages.length)
          const bgName = getBgName(backgroundImages[bgIndex])
          bg.setTexture(bgName)
          playIdleEnemy(enemy)
          //this.cameras.main.fadeIn(1000, 0, 0, 0);
        }
      );
    } else if (level.value.state === 'loaded') {
      this.cameras.main.fadeIn(1000, 0, 0, 0);
    }
  })
}


const gameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 800,
  parent: 'phaser-game',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: {
    preload: preload,
    create: create
  }
};

export const Game = () => {
  useEffect(() => {
    if (!game) {
      game = new Phaser.Game(gameConfig);
    }
    return () => {
      game.destroy(true)
      game = null
      gameSignalEffect && gameSignalEffect()
      enemyHealthEffect && enemyHealthEffect()
      gameLevelEffect && gameLevelEffect()
    }
  }, []);

  return <div id="phaser-game" />;
}
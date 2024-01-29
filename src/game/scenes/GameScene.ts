import { createActors } from "../setup/actorHandlers"
import { buildWorld } from "../setup/worldHandler"

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }
  create() {
    buildWorld(this)
    createActors(this)
  }
}


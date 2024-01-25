import Phaser from 'phaser'
export type resultType = {
  type: string
  formula: string
  answer: number
  level: number
  time: number | undefined
  timeRatio: number | undefined
}
export type damageType = { state: string; hits: number[] }
export type commandType = { type: string; value: number }
export type enemyHealthType = { total: number; current: number }
export type levelType = { current: number; state: string }
export type problemType = { text: string; answer: number }
export type attackTimerType = { state: string; startTime: number }
export type attackDurationType = { duration: number }
export type effectUnsubscribeType = () => void

export type customSpriteType = Phaser.GameObjects.Sprite & {
  jumpBackFrameDistance: number
}

import { attack, clearDamage, decreaseDuration, storeResult } from './gameCommands'
import { attackDurationType, attackTimerType, problemType, resultType } from '../types'

const reportResult = (reportObj: resultType, attackTimerPeek?: attackTimerType, attackDurationPeek?: attackDurationType) => {
  const recordTime = new Date()
  if (attackTimerPeek && attackDurationPeek) {
    const time = recordTime.getTime() - attackTimerPeek.startTime
    const timeRatio = reportObj.type === 'correct' ? time / attackDurationPeek.duration : 1
    storeResult({ type: reportObj.type, formula: reportObj.formula, answer: reportObj.answer, level: reportObj.level, time, timeRatio })
  } else {
    storeResult({ type: reportObj.type, formula: reportObj.formula, answer: reportObj.answer, level: reportObj.level })
  }
}


const determineAttackType = (startTime: number, duration: number): string => {
  const responseTime = new Date().getTime() - startTime
  const timePercentage = responseTime / duration
  if (timePercentage >= 0.66) {
    return 'attack1'
  } else if (timePercentage >= 0.33) {
    return 'attack2'
  } else if (timePercentage >= 0) {
    return 'attack3'
  }
  return 'attack1'
}

const shouldMakeHarder = (attackType: string): boolean => ['attack2', 'attack3'].includes(attackType)

export const handleCorrectAnswer = (attackDurationPeek: attackDurationType, attackTimerPeek: attackTimerType, reportObj: resultType, problemPeek: problemType) => {
  const { startTime, state } = attackTimerPeek
  const { duration } = attackDurationPeek
  reportObj.type = 'correct'
  clearDamage()
  if (state === 'running') {
    reportResult(reportObj, attackTimerPeek, attackDurationPeek)
    const attackType: string = determineAttackType(startTime, duration)
    attack(attackType, problemPeek.answer)
    shouldMakeHarder(attackType) && decreaseDuration()
  } else {
    reportResult(reportObj)
    attack('attack1', problemPeek.answer)
  }
}

export const handleWrongAnswer = (attackDurationPeek: attackDurationType, attackTimerPeek: attackTimerType, reportObj: resultType) => {
  const { state } = attackTimerPeek
  reportObj.type = 'wrong'
  if (state === 'running') {
    reportResult(reportObj, attackTimerPeek, attackDurationPeek)
  } else {
    reportResult(reportObj)
  }
}
export const handleTimeout = (attackTimerPeek: attackTimerType, reportObj: resultType) => {
  reportObj.type = 'timeout'
  reportResult(reportObj, attackTimerPeek)
}

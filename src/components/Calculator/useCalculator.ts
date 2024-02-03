import { useSignals } from '@preact/signals-react/runtime'
import { attackDuration, attackTimer, command, enemyHealth, level, problem } from '../../signals'
import { effect, useSignal } from '@preact/signals-react'
import { attack, clearDamage, decreaseDuration, increaseDuration, newProblem, resetAttackTimer, startAttackTimer, storeResult } from '../../controllers/gameCommands'
import { useEffect, useRef } from 'react'
import { getRandomInt } from '../../utils/utils'
import { attackDurationType, attackTimerType, commandType, effectUnsubscribeType, levelType, problemType, resultType } from '../../types'
const DEBUG = false

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

const isAnswerComplete = (input: string, problemValue: problemType): boolean => {
  const answerString = '' + problemValue.answer
  return input.length === answerString.length
}

const determineAttackType = (startTime: number, duration: number) : string => {
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

const shouldMakeHarder = (attackType: string) : boolean => ['attack2', 'attack3'].includes(attackType)

const handleCorrectAnswer = (attackDurationPeek: attackDurationType, attackTimerPeek: attackTimerType, reportObj: resultType, problemPeek: problemType) => {
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
const handleWrongAnswer = (attackDurationPeek: attackDurationType, attackTimerPeek: attackTimerType, reportObj: resultType, failCallback: () => void) => {
  const { state } = attackTimerPeek
  reportObj.type = 'wrong'
  if (state === 'running') {
    reportResult(reportObj, attackTimerPeek, attackDurationPeek)
  } else {
    reportResult(reportObj)
  }
  failCallback()
}

export const useCalcualtor = () => {
  useSignals()
  const output = useSignal<string>('')
  const loading = useSignal<boolean>(false)
  const error = useSignal<boolean>(false)
  const effectRef = useRef<effectUnsubscribeType>()
  const timerRef = useRef<effectUnsubscribeType>()
  const startAttackDelayRef = useRef<NodeJS.Timeout>()
  const debugRef = useRef<NodeJS.Timeout>()

  const fail = () => {
    resetAttackTimer(true)
    error.value = true
    loading.value = true
    setTimeout(() => {
      increaseDuration()
      newProblem()
      clear()
      error.value = false
      loading.value = false
    }, 1000)
  }

  const onClick = (num: string) => () => {
    if (command.value.type !== 'idle') return
    if (loading.value) return

    output.value += num
    if (!isAnswerComplete(output.value, problem.value)) return

    const attackTimerPeek = attackTimer.peek()
    const attackDurationPeek = attackDuration.peek()
    const problemPeek = problem.peek()
    const levelPeek = level.peek()

    const reportObj: resultType = { type: 'pending', formula: problemPeek.text, answer: parseInt(output.value), level: levelPeek.current }
    if (problem.value.answer === parseInt(output.value)) {
      handleCorrectAnswer(attackDurationPeek, attackTimerPeek, reportObj, problemPeek)
    } else {
      handleWrongAnswer(attackDurationPeek, attackTimerPeek, reportObj, fail)
    }
  }

  const clear = () => {
    output.value = ''
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    const number = parseInt(e.key)
    if (number >= 0 && number <= 9) {
      onClick(e.key)()
    }
  }

  const handleAttackTimer = () => {
    const eHealthPeek = enemyHealth.peek()
    const attackTimePeek = attackTimer.peek()

    const fullHealth = eHealthPeek.current === eHealthPeek.total
    if (!fullHealth && eHealthPeek.current !== 0) {
      // new problem received after first hit
      if (attackTimePeek.state === 'init') {
        startAttackDelayRef.current = setTimeout(() => {
          startAttackTimer()
        }, 100)
      }
    }
  }

  const shouldDisplayProblem = (commandValue: commandType, levelValue: levelType, loadingValue: boolean): boolean => {
    const isIdle = commandValue.type === 'idle'
    const eHealthPeek = enemyHealth.peek()
    const attackTimePeek = attackTimer.peek()

    return levelValue.state !== 'loading' && isIdle && !loadingValue && (attackTimePeek.state.includes('init') || attackTimePeek.state.includes('running')) && eHealthPeek.current !== 0
  }

  //codescene
  const debug = (problemValue: problemType, commandValue: commandType, levelValue: levelType, loadingValue: boolean) => {
    const displayProblem = shouldDisplayProblem(commandValue, levelValue, loadingValue)
    const eHealthPeek = enemyHealth.peek()
    const attackTimePeek = attackTimer.peek()
    console.log('displayProblem', displayProblem)
    console.log('state', { eHealthPeek, levelValue, loadingValue, attackTimePeek, commandValue, problemValue })
    if (!displayProblem) return
    clearTimeout(debugRef.current)
    const time = getRandomInt(500, 4900)
    console.log('Will answer in', time, 'ms')
    debugRef.current = setTimeout(() => {
      const toss = 1 //getRandomInt(0, 2)
      if (toss) {
        onClick(problemValue.answer + '')()
      } else {
        const ans = problemValue.answer + ''
        ans.length === 1 ? onClick('9')() : onClick('99')()
      }
    }, time)
  }

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress)
    timerRef.current = effect(() => {
      if (attackTimer.value.state === 'miss') {
        reportResult({ type: 'timeout', formula: problem.peek().text, answer: 0, level: level.peek().current }, attackTimer.peek())
        fail()
      }
    })
    effectRef.current = effect(() => {
      const commandValue = command.value
      const levelValue = level.value
      const loadingValue = loading.value
      const problemValue = problem.value

      const isIdle = commandValue.type === 'idle'
      const isLevelLoaded = levelValue.state === 'loaded'

      if (!problemValue || !isIdle) return

      isLevelLoaded && handleAttackTimer()
      clear()
      DEBUG && debug(problemValue, commandValue, levelValue, loadingValue)
    })
    return () => {
      window.removeEventListener('keypress', handleKeyPress)
      effectRef.current?.()
      timerRef.current?.()
      clearTimeout(debugRef.current)
      clearTimeout(startAttackDelayRef.current)
    }
  }, [])

  const displayProblem = level.value.state !== 'loading' && command.value.type === 'idle' && !loading.value && enemyHealth.value.current !== 0
  const displayCorrect = command.value.type !== 'idle'
  const displayError = error.value
  return { onClick, clear, displayProblem, displayCorrect, displayError, problemValue: problem.value, outputValue: output.value }
}

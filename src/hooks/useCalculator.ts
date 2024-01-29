import { useSignals } from '@preact/signals-react/runtime'
import { attackDuration, attackTimer, command, enemyHealth, level, problem } from '../signals'
import { effect, useSignal } from '@preact/signals-react'
import { attack, clearDamage, decreaseDuration, increaseDuration, newProblem, resetAttackTimer, startAttackTimer, storeResult } from '../signals/gameCommands'
import { useEffect, useRef } from 'react'
import { getRandomInt } from '../utils/utils'
import { attackDurationType, attackTimerType, commandType, effectUnsubscribeType, levelType, problemType, resultType } from '../types'
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

  const isAnswerComplete = (input: string, problemValue: problemType): boolean => {
    const answerString = '' + problemValue.answer
    return input.length === answerString.length
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

    const { startTime, state } = attackTimerPeek
    if (problem.value.answer === parseInt(output.value)) {
      const { duration } = attackDurationPeek
      clearDamage()
      if (state === 'running') {
        const responseTime = new Date().getTime() - startTime
        const timePercentage = responseTime / duration

        reportResult({ type: 'correct', formula: problemPeek.text, answer: problem.value.answer, level: levelPeek.current }, attackTimerPeek, attackDurationPeek)
        if (timePercentage >= 0.66) {
          attack('attack1', problem.value.answer)
        } else if (timePercentage >= 0.33) {
          attack('attack2', problem.value.answer)
          decreaseDuration()
        } else if (timePercentage >= 0) {
          attack('attack3', problem.value.answer)
          decreaseDuration()
        }
      } else {
        reportResult({ type: 'correct', formula: problemPeek.text, answer: problem.value.answer, level: levelPeek.current })
        attack('attack1', problem.value.answer)
      }
    } else {
      if (state === 'running') {
        reportResult({ type: 'wrong', formula: problemPeek.text, answer: parseInt(output.value), level: levelPeek.current }, attackTimerPeek, attackDurationPeek)
      } else {
        reportResult({ type: 'wrong', formula: problemPeek.text, answer: parseInt(output.value), level: levelPeek.current })
      }
      fail()
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
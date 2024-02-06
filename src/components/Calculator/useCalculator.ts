import { useSignals } from '@preact/signals-react/runtime'
import { attackDuration, attackTimer, command, enemyHealth, level, problem } from '../../signals'
import { effect, useSignal } from '@preact/signals-react'
import { increaseDuration, newProblem, resetAttackTimer, startAttackTimer } from '../../controllers/gameCommands'
import { useEffect, useRef } from 'react'
import { getRandomInt } from '../../utils/utils'
import { commandType, effectUnsubscribeType, levelType, problemType, resultType } from '../../types'
import { handleCorrectAnswer, handleTimeout, handleWrongAnswer } from '../../controllers/problemCommands'
const DEBUG = false

const isAnswerComplete = (input: string, problemValue: problemType): boolean => {
  const answerString = '' + problemValue.answer
  return input.length === answerString.length
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
      handleWrongAnswer(attackDurationPeek, attackTimerPeek, reportObj)
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
    const enemyAlive = enemyHealth.peek().current !== 0
    const timerReady = attackTimer.peek().state.includes('init') || attackTimer.peek().state.includes('running')
    const notLoadingCalculator = !loadingValue
    const notLoadingNewLevel = levelValue.state !== 'loading'

    return notLoadingNewLevel && isIdle && notLoadingCalculator && timerReady && enemyAlive
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
        const attackTimerPeek = attackTimer.peek()
        const problemPeek = problem.peek()
        const levelPeek = level.peek()
        const reportObj: resultType = { type: 'timeout', formula: problemPeek.text, answer: 0, level: levelPeek.current }
        handleTimeout(attackTimerPeek, reportObj)
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

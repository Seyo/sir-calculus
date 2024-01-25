import { useSignals } from '@preact/signals-react/runtime'
import { attackDuration, attackTimer, command, enemyHealth, level, problem } from '../signals'
import style from './Calculator.module.css'
import { effect, useSignal } from '@preact/signals-react'
import { attack, clearDamage, decreaseDuration, increaseDuration, newProblem, resetAttackTimer, startAttackTimer, storeResult } from '../signals/gameCommands'
import { useEffect, useRef } from 'react'
import { Timer } from './Timer'
import { getRandomInt } from '../utils/utils'
import { attackDurationType, attackTimerType, effectUnsubscribeType, problemType } from '../types'
const DEBUG = false

const reportResult = (type: string, formula: string, answer: number, level: number, attackTimerPeek: attackTimerType | undefined, attackDurationPeek: attackDurationType | undefined) => {
  const recordTime = new Date()
  if (attackTimerPeek && attackDurationPeek) {
    const time = recordTime.getTime() - attackTimerPeek.startTime
    const timeRatio = type === 'correct' ? time / attackDurationPeek.duration : 1
    storeResult({ type, formula, answer, level, time, timeRatio })
  } else {
    storeResult({ type, formula, answer, level, time: undefined, timeRatio:undefined })
  }
}

export const Calculator = () => {
  useSignals()
  const output = useSignal<string>('')
  const loading = useSignal<boolean>(false);
  const error = useSignal<boolean>(false);
  const effectRef = useRef<effectUnsubscribeType>();
  const timerRef = useRef<effectUnsubscribeType>();
  const startAttackDelayRef = useRef<NodeJS.Timeout>();
  const debugRef = useRef<NodeJS.Timeout>();

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
    const answerString = '' + problem.value.answer
    if (output.value.length === answerString.length) {

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

          reportResult('correct', problemPeek.text, problem.value.answer, levelPeek.current, attackTimerPeek, attackDurationPeek)
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
          reportResult('correct', problemPeek.text, problem.value.answer, levelPeek.current, undefined, undefined)
          attack('attack1', problem.value.answer)
        }
      } else {
        if (state === 'running') {
          reportResult('wrong', problemPeek.text, parseInt(output.value), levelPeek.current, attackTimerPeek, attackDurationPeek)
        } else {
          reportResult('wrong', problemPeek.text, parseInt(output.value), levelPeek.current, undefined, undefined)

        }
        fail()
      }
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

  const debug = (prob: problemType) => {
    clearTimeout(debugRef.current)
    const time = getRandomInt(500, 4900)
    console.log('Will answer in', time, 'ms')
    debugRef.current = setTimeout(() => {
      const toss = 1//getRandomInt(0, 2)
      if (toss) {
        onClick(prob.answer + '')()
      } else {
        const ans = prob.answer + ''
        ans.length === 1 ? onClick('9')() : onClick('99')()
      }
    }, time)
  }

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress)
    timerRef.current = effect(() => {
      if (attackTimer.value.state === 'miss') {
        reportResult('timeout', problem.peek().text, 0, level.peek().current, attackTimer.peek(), undefined)
        fail()
      }
    })
    effectRef.current = effect(() => {
      const isIdle = command.value.type === 'idle'
      const eHealthPeek = enemyHealth.peek()
      const attackTimePeek = attackTimer.peek()

      const fullHealth = eHealthPeek.current === eHealthPeek.total
      const levelPeek = level.value
      const levelLoaded = levelPeek.state === 'loaded'

      const displayProblem = levelPeek.state !== 'loading' && isIdle && !loading.value && (attackTimePeek.state.includes('init') || attackTimePeek.state.includes('running')) && eHealthPeek.current !== 0
      DEBUG && console.log(displayProblem, eHealthPeek, levelPeek, loading.value, attackTimePeek, command.value, problem.peek())
      if (!problem.peek() || !isIdle) return

      if (levelLoaded) {
        clear()
        if (!fullHealth && eHealthPeek.current !== 0) {
          // new problem received after first hit
          if (attackTimePeek.state === 'init') {

            startAttackDelayRef.current = setTimeout(() => {
              startAttackTimer()
            }, 100);
          }
        }
      } else {
        //New problem received during level loading
        clear()
      }
      if (displayProblem && DEBUG) {
        debug(problem.value)
      }
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

  return (
    <>
      <div className={style.calculator}>
        {displayProblem && <div className={style.problem}>{problem.value.text}</div>}
        {displayCorrect && <div className={style.correct}></div>}
        {displayError && <div className={style.error}></div>}
        <Timer />
        <div className={style.input}>{output.value}</div>
        <div className={style.keypad} style={displayProblem ? {} : { opacity: 0.2 }}>
          <div onClick={onClick('7')} className={style.button}>
            7
          </div>
          <div onClick={onClick('8')} className={style.button}>
            8
          </div>
          <div onClick={onClick('9')} className={style.button}>
            9
          </div>
          <div onClick={onClick('4')} className={style.button}>
            4
          </div>
          <div onClick={onClick('5')} className={style.button}>
            5
          </div>
          <div onClick={onClick('6')} className={style.button}>
            6
          </div>
          <div onClick={onClick('1')} className={style.button}>
            1
          </div>
          <div onClick={onClick('2')} className={style.button}>
            2
          </div>
          <div onClick={onClick('3')} className={style.button}>
            3
          </div>
          <div onClick={onClick('0')} className={style.button}>
            0
          </div>
          <div onClick={clear} className={style.button}>
            C
          </div>
          {/* <div onClick={goToMenu} className={style.button} style={{ backgroundImage: 'url(/sword.png)', backgroundPosition: '-6px -4px' }}>          </div> */}
        </div>
      </div>
    </>
  )
}

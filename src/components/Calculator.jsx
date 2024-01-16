import { useSignals } from '@preact/signals-react/runtime'
import { attackTimer, command, enemyHealth, level, problem } from '../signals'
import style from './Calculator.module.css'
import { effect, useSignal } from '@preact/signals-react'
import { attack, clearDamage, decreaseDuration, increaseDuration, newProblem, resetAttackTimer, startAttackTimer } from '../signals/gameCommands'
import { useEffect, useRef } from 'react'
import { Timer } from './Timer'

const reportResult = (type, formula, answer, level, attackTimerPeek) => {
  const recordTime = new Date()
  if (attackTimerPeek) {
    const time = type === 'correct' ? recordTime.getTime() - attackTimerPeek.startTime : attackTimerPeek.duration
    const timeRatio = type === 'correct' ? time / attackTimerPeek.duration : -1
    console.log(type, formula, answer, level, time, timeRatio)
  } else {
    console.log(type, formula, answer, level)
  }
}

export const Calculator = () => {
  useSignals()
  const output = useSignal('')
  const loading = useSignal(false)
  const error = useSignal(false)
  const effectRef = useRef()
  const timerRef = useRef()

  // const duration = useSignal(10000)
  // const countDownStartTime = useSignal(new Date())
  // const runAnimation = useSignal(false)

  const fail = () => {
    resetAttackTimer()
    error.value = true
    loading.value = true
    setTimeout(() => {
      increaseDuration()
      newProblem()
      clear()
      error.value = false
      loading.value = false
    }, 2000)
  }

  const win = () => {
    clearDamage()
    attack('attack4', problem.value.answer)
    decreaseDuration()
  }

  const onClick = (num) => () => {
    if (command.value.type !== 'idle') return
    if (loading.value) return
    output.value += num
    const answerString = '' + problem.value.answer
    if (output.value.length === answerString.length) {
      if (problem.value.answer === parseInt(output.value)) {
        const { startTime, duration, state } = attackTimer.peek()
        clearDamage()
        if (state === 'running') {
          const responseTime = new Date().getTime() - startTime
          const timePercentage = responseTime / duration

          reportResult('correct', problem.peek().text, problem.value.answer, level.peek().current, attackTimer.peek())
          if (timePercentage >= 0.66) {
            attack('attack1', problem.value.answer)
          } else if (timePercentage >= 0.33) {
            attack('attack2', problem.value.answer)
            decreaseDuration()
          } else if (timePercentage >= 0) {
            attack('attack4', problem.value.answer)
            decreaseDuration()
          }
        } else {
          reportResult('correct', problem.peek().text, problem.value.answer, level.peek().current)
          attack('attack1', problem.value.answer)
        }
      } else {
        reportResult('wrong', problem.peek().text, output.value, level.peek().current, attackTimer.peek())
        fail()
      }
    }
  }
  const clear = () => {
    output.value = ''
  }

  const handleKeyPress = (e) => {
    const number = parseInt(e.key)
    if (number >= 0 && number <= 9) {
      onClick(e.key)()
    }
  }

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress)
    timerRef.current = effect(() => {
      if (attackTimer.value.state === 'miss') {
        reportResult('timeout', problem.peek().text, 'N/A', level.peek().current, attackTimer.peek())
        fail()
      }
    })
    effectRef.current = effect(() => {
      const isIdle = command.value.type === 'idle'
      if (!problem.value || !isIdle) return
      const eHealthPeek = enemyHealth.peek()
      const fullHealth = eHealthPeek.current === eHealthPeek.total
      const levelPeek = level.peek()
      const levelLoaded = levelPeek.state === 'loaded'

      if (levelLoaded) {
        clear()
        if (!fullHealth) {
          // new problem received after first hit
          startAttackTimer()
        } else {
          // first problem on startup
        }
      } else {
        //New problem received during level loading
        clear()
      }
    })
    return () => {
      window.removeEventListener('keypress', handleKeyPress)
      effectRef.current()
      timerRef.current()
    }
  }, [])

  const displayProblem = level.value.state !== 'loading' && command.value.type === 'idle' && !loading.value
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
          <div onClick={win} className={style.button} style={{ backgroundImage: 'url(sword.png)', backgroundPosition: '-6px -4px' }}>
          </div>
        </div>
      </div>
    </>
  )
}

import { useSignals } from '@preact/signals-react/runtime';
import { command, damage, level, problem } from '../signals';
import style from './Calculator.module.css'
import { effect, useSignal } from '@preact/signals-react';
import { attack, clearDamage, newProblem } from '../signals/gameCommands';
import { useEffect, useRef } from 'react';
export const Calculator = () => {
  useSignals();
  const output = useSignal('')
  const loading = useSignal(false)
  const error = useSignal(false)
  const effectRef = useRef();

  const duration = useSignal(10000)
  const countDownStartTime = useSignal(new Date())
  const runAnimation = useSignal(false)

  const onClick = (num) => (e) => {
    if (command.value.type !== 'idle') return
    output.value += num
    const answerString = '' + problem.value.answer
    if (output.value.length === answerString.length) {
      if (problem.value.answer === parseInt(output.value)) {
        clearDamage()
        attack('attack1', problem.value.answer)
      } else {
        error.value = true
        loading.value = true
        setTimeout(() => {
          newProblem()
          clear()
          error.value = false
          loading.value = false
        }, 2000)
      }
    }
  }
  const clear = () => {
    output.value = ''
  }

  useEffect( () => {
    effectRef.current = effect(() => {
      if (problem.value && command.value.type === 'idle' && level.peek().state === 'loaded' && level.value.current !== 1) {
        console.log('START COUNTDOWN')
        clear()
      } else if (problem.value && command.value.type === 'idle' && level.peek().state === 'loaded' && level.value.current === 1) {
        clear()
      } else if (problem.value && command.value.type === 'idle' && level.peek().state === 'loading') {
        clear()
      }
    })
    return () => {
      effectRef.current()
    }
  }, [])

  const displayProblem = (level.value.state !== 'loading' && command.value.type === 'idle' && !loading.value)
  const displayCorrect = command.value.type !== 'idle'
  const displayError = error.value

  return <>
    <div className={style.calculator}>
      {displayProblem && <div className={style.problem}>{problem.value.text}</div>}
      {displayCorrect && <div className={style.correct}></div>}
      {displayError && <div className={style.error}></div>}
      <div className={style.input}>{output.value}</div>
      <div className={style.keypad} style={displayProblem ? {} : { opacity: 0.2 }}>
        <div onClick={onClick('7')} className={style.button}>7</div>
        <div onClick={onClick('8')} className={style.button}>8</div>
        <div onClick={onClick('9')} className={style.button}>9</div>
        <div onClick={onClick('4')} className={style.button}>4</div>
        <div onClick={onClick('5')} className={style.button}>5</div>
        <div onClick={onClick('6')} className={style.button}>6</div>
        <div onClick={onClick('1')} className={style.button}>1</div>
        <div onClick={onClick('2')} className={style.button}>2</div>
        <div onClick={onClick('3')} className={style.button}>3</div>
        <div onClick={onClick('0')} className={style.button}>0</div>
        <div onClick={clear} className={style.button}>C</div>
      </div>
    </div>
  </>
}
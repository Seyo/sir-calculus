
import { command, gameEffect } from '../signals'
import style from './GameController.module.css'
import { useEffect, useRef,  } from 'react'
import { useSignals } from '@preact/signals-react/runtime'
import { attack, clearDamage, reset } from '../signals/gameCommands'
export const GameController = () => {
  useSignals();
  const onClick = (action) => (e) => {
    if (command.value.type === 'idle') {
      clearDamage()
      attack(action, 20)
    } else {
      //reset()
    }
  }

  return <>
    <div className={style.GameController}>
      <div className={style.button} style={command.value.type !== 'idle' ? {opacity: 0.2} : {}} onClick={onClick('attack1')}>Hit me</div>
      <div className={style.button} style={command.value.type !== 'idle' ? { opacity: 0.2 } : {}} onClick={onClick('attack2')}>Hit me harder</div>
      <div className={style.button} style={command.value.type !== 'idle' ? { opacity: 0.2 } : {}} onClick={onClick('attack3')}>Hit me even harder</div>
      <div className={style.button} style={command.value.type !== 'idle' ? { opacity: 0.2 } : {}} onClick={onClick('attack4')}>Hit me with jump!</div>
    </div>
  </>
}
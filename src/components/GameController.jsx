
import { attackDuration, attackTimer, command, damage, enemyHealth, gameEffect, level, problem } from '../signals'
import style from './GameController.module.css'
import { useSignals } from '@preact/signals-react/runtime'
import { attack, clearDamage } from '../signals/gameCommands'
export const GameController = () => {
  useSignals();
  const onClick = (action) => () => {
    if (command.value.type === 'idle') {
      clearDamage()
      attack(action, 20)
    } else {
      //reset()
    }
  }

  return <>
    <div className={style.GameController}>
      <div className={style.button} style={command.value.type !== 'idle' ? { opacity: 0.2 } : {}} onClick={onClick('attack1')}>Hit me</div>
      <div className={style.button} style={command.value.type !== 'idle' ? { opacity: 0.2 } : {}} onClick={onClick('attack2')}>Hit me harder</div>
      <div className={style.button} style={command.value.type !== 'idle' ? { opacity: 0.2 } : {}} onClick={onClick('attack3')}>Hit me even harder</div>
      <div>
        Level current: {level.value.current}
      </div>
      <div>
        Level state: {level.value.state}
      </div>
      <div>
        Command type: {command.value.type}
      </div>
      <div>
        gameEffect: {gameEffect.value}
      </div>
      <div>
        damage state: {damage.value.state}
      </div>
      <div>
        damage hits: {damage.value.hits.join('+')}
      </div>
      <div>
        enemyHealth total: {enemyHealth.value.total}
      </div>
      <div>
        enemyHealth current: {enemyHealth.value.current}
      </div>
      <div>
        problem: {problem.value.text}
      </div>
      <div>
        problem: {problem.value.answer}
      </div>
      <div>
        attackTimer state: {attackTimer.value.state}
      </div>
      <div>
        attackDuration duration: {attackDuration.value.duration}
      </div>
    </div>
  </>
}
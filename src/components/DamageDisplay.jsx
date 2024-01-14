
import { damage, enemyHealth, level } from '../signals'
import style from './DamageDisplay.module.css'
import { useSignals } from '@preact/signals-react/runtime'

export const DamageDisplay = () => {
  useSignals();
  const { hits, state } = damage.value
  const {current, total} = enemyHealth.value

  const sum = hits.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
  const formula = hits.join(' + ') + ' = ' + sum

  return <>
    <div className={style.damageDisplay} >
      <div className={style.healthBarOuter}>
        <div className={style.healthBarInner} style={{ width: `${current / total * 100}%` }}>
          <div className={style.healthText}>{`${current}/${total}`}</div>
          {state === 'inProgress' && hits.map((dmg, idx) => <div key={'dmg_' + idx} className={style.hitDmg} style={{ right: `${dmg / current * 100 * idx}%`, width: `${dmg / current * 100}%`, opacity: (hits.length - idx) * 0.3 + 0.3 }} />)}
        </div>
      </div>
      <div>Level: {level.value.current} { level.value.state }</div>
      <div>Attack: {state}</div>
      {sum ? <div>Damage: {formula}</div> : ''}
    </div>
  </>
}
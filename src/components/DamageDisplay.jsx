
import { damage, enemyHealth, level } from '../signals'
import style from './DamageDisplay.module.css'
import { useSignals } from '@preact/signals-react/runtime'

var percentColors = [
  { pct: 0.0, color: { r: 0x99, g: 0x11, b: 0x11 } }, //1ba11b
  { pct: 0.5, color: { r: 0xd3, g: 0x81, b: 0x17 } }, //d38117
  { pct: 1.0, color: { r: 0x1b, g: 0xa1, b: 0x1b } }]; //991111

var getColorForPercentage = function (pct) {
  for (var i = 1; i < percentColors.length - 1; i++) {
    if (pct < percentColors[i].pct) {
      break;
    }
  }
  var lower = percentColors[i - 1];
  var upper = percentColors[i];
  var range = upper.pct - lower.pct;
  var rangePct = (pct - lower.pct) / range;
  var pctLower = 1 - rangePct;
  var pctUpper = rangePct;
  var color = {
    r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
    g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
    b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
  };
  return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
  // or output as hex if preferred
};



export const DamageDisplay = () => {
  useSignals();
  const { hits, state } = damage.value
  const {current, total} = enemyHealth.value

  const sum = hits.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
  //const formula = hits.join(' + ') + ' = ' + sum

  return <>
    <div className={style.damageDisplay} >
      <div>Level: {level.value.current}</div>
      <div className={style.healthBarOuter}>
        <div className={style.healthBarInner} style={{ width: `${current / total * 100}%`, background: getColorForPercentage((current/total*1)) }}>
          <div className={style.healthText}>{`${current}/${total}`}</div>
          {state === 'inProgress' && hits.map((dmg, idx) => <div key={'dmg_' + idx} className={style.hitDmg} style={{ right: `${dmg / current * 100 * idx}%`, width: `${dmg / current * 100}%`, opacity: (hits.length - idx) * 0.3 + 0.3 }} />)}
        </div>
      </div>
    </div>
    <div className={style.sct}>
      {hits.map((dmg, idx) => <div key={'floater_' + idx} className={style.floatingNumber}>{dmg}</div>)}
      {hits.length ? <div className={style.dmgFormula} key={`${hits[0]}x${hits.length}`}>{`${hits[0]}x${hits.length} = ${sum}`}</div> : ''}
    </div>
  </>
}
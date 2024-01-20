import { results } from '../signals'
import { useSignals } from '@preact/signals-react/runtime'
import style from './ResultLog.module.css'
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react'

const LogItem = ({item}) => {
  let typeStyle = item.type === 'correct' ? style.correct : style.wrong
  let timeSpeed = style.time3

  if (item.timeRatio >= 0.66) {
    timeSpeed = style.time3
  } else if (item.timeRatio >= 0.33) {
    timeSpeed = style.time2
  } else if (item.timeRatio >= 0) {
    timeSpeed = style.time1
  }

  return <div className={`${style.logItem} ${typeStyle}`}>
    <div className={style.level}>lvl: {item.level}</div>
    <div className={style.formula}>{item.formula} = {item.type !== 'timeout' ? item.answer : 'miss'}</div>
    <div className={`${style.time} ${timeSpeed}`}>{item.time ? `${(item.time/1000).toFixed(2)}s` : ''}</div>

  </div>
}
LogItem.propTypes = {
  item: PropTypes.object.isRequired
}

export const ResultLog = () => {
  useSignals()
  const div = useRef(null);
  useEffect(() => {
    div.current.scrollTo({
      top: div.current.scrollHeight,
      behavior: 'smooth',
    });
  })

  return <>
    <div ref={div} className={style.resultLog}>
      {results.value.map((result, idx) => {
        let extra = ''
        if (idx !== 0) {
          if(results.value[idx-1].level !== result.level) {
            extra = <div className={style.levelUp}>Level {result.level}</div>
          }
        }
        return <>
          {extra}
          <LogItem key={`log_${idx}`} item={result} />
        </>
      })}
    </div>
  </>
}
import { attackTimer } from '../signals'
import style from  './Timer.module.css'
export const Timer = () => {
  return <>
    <div className={style.timerContainer}>
      <div className={style.timerOuter}>
        <div className={style.timerInner}>
          <div className={style.timerSegment}></div>
          <div className={style.timerSegment}></div>
          <div className={style.timerSegment}></div>
        </div>
        <div className={`${style.timerIndicator} ${attackTimer.value.state === 'running' ? style.animate : ''}`} style={{animationDuration: `${attackTimer.value.duration}ms`}}></div>
      </div>
    </div>
  </>
}
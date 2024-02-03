import style from './Calculator.module.css'
import { Timer } from './Timer'
import { useCalcualtor } from './useCalculator'

export const Calculator = () => {
  const { onClick, clear, displayProblem, displayCorrect, displayError, problemValue, outputValue } = useCalcualtor()

  return (
    <>
      <div className={style.calculator}>
        {displayProblem && <div className={style.problem}>{problemValue.text}</div>}
        {displayCorrect && <div className={style.correct}></div>}
        {displayError && <div className={style.error}></div>}
        <Timer />
        <div className={style.input}>{outputValue}</div>
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

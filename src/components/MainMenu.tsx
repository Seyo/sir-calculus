import { toggleMenu } from '../signals/gameCommands'
import style from './MainMenu.module.css'

export const MainMenu = () => {
  const startGame = () => {
    toggleMenu()
  }
  return <>
  <div className={style.logo}/>
  <div className={style.mainMenu}>
      <div onClick={startGame} className={style.button}>Start Game</div>
  </div>
  </>
}
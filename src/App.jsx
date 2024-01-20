import './App.css'
import { Calculator } from './components/Calculator'
import { DamageDisplay } from './components/DamageDisplay'
import { Game } from './components/Game'
import { GameController } from './components/GameController'
import { ResultLog } from './components/ResultLog'
function App() {

  return (
    <div className="App">
      <Game />
      {/* <GameController /> */}
      <DamageDisplay />
      <Calculator />
      <ResultLog />
      </div>
  )
}

export default App

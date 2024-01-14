import './App.css'
import { Calculator } from './components/Calculator'
import { DamageDisplay } from './components/DamageDisplay'
import { Game } from './components/Game'
import { GameController } from './components/GameController'
function App() {

  return (
    <div className="App">
      <Game />
      <GameController />
      <DamageDisplay />
      <Calculator />
      </div>
  )
}

export default App

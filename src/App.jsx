import './App.css'
import { Calculator } from './components/Calculator'
import { DamageDisplay } from './components/DamageDisplay'
import { Game } from './components/Game'
// import { GameController } from './components/GameController'
import { MainMenu } from './components/MainMenu'
import { ResultLog } from './components/ResultLog'
import { useSignals } from '@preact/signals-react/runtime'
import { sceneKey } from './signals'
function App() {
  useSignals()
  let content = <div><MainMenu /></div>
  if (sceneKey.value === 'GameScene') {
    content = <div>
      {/* <GameController /> */}
      <DamageDisplay />
      <Calculator />
      <ResultLog />
    </div>
  }

  return (
    <div className="App">
      <Game />
      {content}
      </div>
  )
}

export default App

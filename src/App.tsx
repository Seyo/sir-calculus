import "./App.css";
import { Calculator } from "./components/Calculator/Calculator";
import { DamageDisplay } from "./components/DamageDisplay/DamageDisplay";
import { Game } from "./components/Game/Game";
// import { GameController } from './components/GameController'
import { MainMenu } from "./components/Menu/MainMenu";
import { ResultLog } from "./components/ResultLog/ResultLog";
import { useSignals } from "@preact/signals-react/runtime";
import { sceneKey } from "./signals";
function App() {
  useSignals();
  let content = (
    <div>
      <MainMenu />
    </div>
  );
  if (sceneKey.value === "GameScene") {
    content = (
      <div>
        {/* <GameController /> */}
        <DamageDisplay />
        <Calculator />
        <ResultLog />
      </div>
    );
  }

  return (
    <div className="App">
      <Game />
      {content}
    </div>
  );
}

export default App;

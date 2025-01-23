// import { Routes, Route } from 'react-router-dom';
// import Option from './components/GameModeSelection';
// import MacananGame from './components/HumanVsHumanGame';
// import Home from './components/Home';
// import MacananUwongAI from './components/HumanVsAIUwong';
// import AiUwong from './components/HumanVsAIMacan';
// import AIvsAI from './components/AIVsAIGame';
// import { MacananGameProvider } from './components/MacananGameContext';

import { Route, Routes } from "react-router";
import AIVsAIGame from "./components/AIVsAIGame";
import GameModeSelection from "./components/GameModeSelection";
import HumanVsAIMacan from "./components/HumanVsAIMacan";
import HumanVsAIUwong from "./components/HumanVsAIUwong";
import HumanVsHumanGame from "./components/HumanVsHumanGame";
import { MacananGameProvider } from "./components/MacananGameContext";
import Home from "./components/Home";

const App = () => {
  return (
    <MacananGameProvider>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/game-modes' element={<GameModeSelection />} />
        <Route path="/human-vs-human" element={<HumanVsHumanGame />} />
        <Route path="/human-vs-ai-macan" element={<HumanVsAIMacan />} />
        <Route path="/human-vs-ai-uwong" element={<HumanVsAIUwong />} />
        <Route path="/ai-vs-ai" element={<AIVsAIGame />} />
      </Routes>
    </MacananGameProvider>
  );
}

export default App;
import { Routes, Route } from 'react-router-dom';
import Option from './components/Option';
import MacananGame from './components/MacananGame';
import Home from './components/Home';
import MacananUwongAI from './components/MacananUwongAI';
import AiUwong from './components/AiUwong';
import AIvsAI from './components/AIvsAI';
import { MacananGameProvider } from './components/MacananGameContext';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/option' element={<Option />} />
      <Route path="/game" element={<MacananGame />} />
      {/* <Route path="/AIUwong" element={<AiUwong />} /> */}
      <Route path="/AIUwong" element={<MacananUwongAI />} />
    </Routes>
  );
}

export default App;
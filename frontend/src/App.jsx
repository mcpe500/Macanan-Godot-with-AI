import { Routes, Route } from 'react-router-dom';
import Option from './components/Option';
import MacananGame from './components/MacananGame';
import Home from './components/Home';
import AiUwong from './components/AiUwong';
import AIvsAI from './components/AIvsAI';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/option' element={<Option />} />
      <Route path="/game" element={<MacananGame />} />
      <Route path="/AIUwong" element={<AiUwong />} />
      <Route path="/AIvsAI" element={<AIvsAI />} />
    </Routes>
  );
}

export default App;
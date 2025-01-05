import { Routes, Route } from 'react-router-dom';
import Option from './components/Option';
import MacananGame from './components/MacananGame';
import Home from './components/Home';
import AiUwong from './components/AiUwong';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/option' element={<Option />} />
      <Route path="/game" element={<MacananGame />} />
      <Route path="/AIUwong" element={<AiUwong />} />
    </Routes>
  );
}

export default App;
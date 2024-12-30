import { Routes, Route } from 'react-router-dom';
// import MacananGame from './components/MacananGame';
import Home from './components/Home';
import MacananUwongAI from './components/MacananUwongAI';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      {/* <Route path="/game" element={<MacananGame />} /> */}
      <Route path="/game" element={<MacananUwongAI />} />
    </Routes>
  );
}

export default App;
import { Routes, Route } from 'react-router-dom';
import MacananGame from './components/MacananGame';
import Home from './components/Home';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path="/game" element={<MacananGame />} />
    </Routes>
  );
}

export default App;
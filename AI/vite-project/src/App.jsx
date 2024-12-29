import { Routes, Route } from 'react-router-dom';
import Home from './Home.jsx';
import Game from './Game.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  );
};

export default App;
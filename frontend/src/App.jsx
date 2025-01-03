import { Routes, Route } from 'react-router-dom';
import Option from './components/Option';
import MacananGame from './components/MacananGame';
import Home from './components/Home';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/option' element={<Option />} />
      <Route path="/game" element={<MacananGame />} />
      
    </Routes>
  );
}

export default App;
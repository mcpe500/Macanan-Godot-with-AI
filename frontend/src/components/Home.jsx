import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const startGame = () => {
    navigate('/game');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center bg-white p-12 rounded-lg shadow-xl">
        <h1 className="text-4xl mb-4 text-blue-600 font-bold">Welcome to the Macanan Game</h1>
        <p className="text-xl mb-4 text-gray-600">Get ready for an exciting adventure!</p>
        <button 
          onClick={startGame}
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg shadow-md transition duration-200"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default Home;
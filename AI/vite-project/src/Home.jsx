import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const startGame = () => {
    navigate('/game');
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-dark">
      <div className="text-center bg-light p-5 rounded-lg shadow-lg">
        <h1 className="display-4 mb-4 text-primary">Welcome to the Game</h1>
        <p className="lead mb-4">Get ready for an exciting adventure!</p>
        <button 
          onClick={startGame}
          className="btn btn-primary btn-lg px-5 py-3 shadow-sm"
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default Home;
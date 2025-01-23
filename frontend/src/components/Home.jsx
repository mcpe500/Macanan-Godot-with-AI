import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center bg-white p-12 rounded-lg shadow-xl">
        <h1 className="text-4xl mb-4 text-blue-600 font-bold">Welcome to the Macanan Game</h1>
        <p className="text-xl mb-4 text-gray-600">Get ready for an exciting adventure!</p>
        <a 
          href="/game-modes"
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg shadow-md transition duration-200 inline-block"
        >
          Start Game
        </a>
      </div>
    </div>
  );
};

export default Home;
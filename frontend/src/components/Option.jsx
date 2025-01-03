import React from 'react'
import { useNavigate } from 'react-router-dom';

function Option() {
    const navigate = useNavigate();
    
    const PlayerVsPlayers = () => {
        navigate('/game');
    };
    const AiVsUwong = () => {

    };
    const AiVsMcan = () => {

    };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center bg-white p-12 rounded-lg shadow-xl ">
        <h1 className="text-4xl mb-4 text-blue-600 font-bold">Which type game Will You Play</h1>
        <p className="text-xl mb-4 text-gray-600">Get ready for an exciting adventure!</p>
        <button 
          onClick={PlayerVsPlayers}
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg shadow-md transition duration-200 mb-3"
        >
          2 Player
        </button><br />
        <button 
          onClick={AiVsUwong}
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg shadow-md transition duration-200 mb-3"
        >
          Uwong Vs Macan Ai
        </button><br />
        <button 
          onClick={AiVsMcan}
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg shadow-md transition duration-200"
        >
          Uwong Ai Vs Macan
        </button>
      </div>
    </div>
  )
}

export default Option
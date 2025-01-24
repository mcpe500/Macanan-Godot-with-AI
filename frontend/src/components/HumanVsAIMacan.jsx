// AiUwong.jsx
import React, {useEffect} from 'react';
import {MacananGameProvider, useMacananGame} from './MacananGameContext';

const HumanVsAIMacan = () => {
  const {
    board,
    currentPlayer,
    uwongPawnsInHand,
    message,
    win,
    winner,
    uwongTotal,
    nodePositions,
    boardRef,
    handleClick,
    renderConnections,
    handleAIClick,
    goBack,
    restartGame
  } = useMacananGame();

  // Trigger AI move when it's Macan's turn
  useEffect(() => {
    if (!win && currentPlayer === 'macan') {
      handleAIClick();
    }
  }, [currentPlayer, win, handleAIClick]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="relative w-full max-w-4xl mx-auto" ref={boardRef}>
        <svg className="absolute w-full h-full pointer-events-none">
          {renderConnections()}
        </svg>
        <div className="flex flex-col items-center gap-4">
          <div className="text-xl font-bold text-center">{message}</div>
          <div className="flex justify-center items-center gap-8">
            {/* Left Wing */}
            <div className="grid grid-cols-1 gap-20">
              {[25, 27, 29].map((index) => (
                <button
                  key={index}
                  data-position={index}
                  className={`w-12 h-12 rounded-full relative z-10 ${
                    board[index] === 'uwong' ? 'bg-green-500' :
                      board[index] === 'macan' ? 'bg-red-500' :
                        'bg-gray-200'
                  }`}
                  onClick={() => handleClick(index)}
                >{index}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[26, 28, 30].map((index) => (
                <button
                  key={index}
                  data-position={index}
                  className={`w-12 h-12 rounded-full relative z-10 ${
                    board[index] === 'uwong' ? 'bg-green-500' :
                      board[index] === 'macan' ? 'bg-red-500' :
                        'bg-gray-200'
                  }`}
                  onClick={() => handleClick(index)}
                >{index}</button>
              ))}
            </div>

            {/* Main 5x5 Grid */}
            <div className="grid grid-cols-5 gap-4">
              {Array(25).fill(null).map((_, index) => (
                <button
                  key={index}
                  data-position={index}
                  className={`w-12 h-12 rounded-full relative z-10 ${
                    board[index] === 'uwong' ? 'bg-green-500' :
                      board[index] === 'macan' ? 'bg-red-500' :
                        'bg-gray-200'
                  }`}
                  onClick={() => handleClick(index)}
                >{index}</button>
              ))}
            </div>

            {/* Right Wing */}
            <div className="grid grid-cols-1 gap-4">
              {[31, 33, 35].map((index) => (
                <button
                  key={index}
                  data-position={index}
                  className={`w-12 h-12 rounded-full relative z-10 ${
                    board[index] === 'uwong' ? 'bg-green-500' :
                      board[index] === 'macan' ? 'bg-red-500' :
                        'bg-gray-200'
                  }`}
                  onClick={() => handleClick(index)}
                >{index}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-20">
              {[32, 34, 36].map((index) => (
                <button
                  key={index}
                  data-position={index}
                  className={`w-12 h-12 rounded-full relative z-10 ${
                    board[index] === 'uwong' ? 'bg-green-500' :
                      board[index] === 'macan' ? 'bg-red-500' :
                        'bg-gray-200'
                  }`}
                  onClick={() => handleClick(index)}
                >{index}</button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm">Remaining Unused Uwong pawns: {uwongPawnsInHand}</div>
          </div>
          <div className="mt-2">
            <div className="text-sm">Total Uwong pawns: {uwongTotal}</div>
          </div>
          {win && 
          <div className="flex gap-4">
            <button 
              onClick={goBack}
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg shadow-md transition duration-200"
            >
              Go Back
            </button>
            <button 
              onClick={restartGame}
              className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-3 rounded-lg shadow-md transition duration-200"
            >
              Restart
            </button>
          </div>
        }
        </div>
      </div>
    </div>
  );
};

export default HumanVsAIMacan;
import { useEffect, useState } from 'react';
import { getBestMove } from '../utils/generic';
import { useMacananGame } from './MacananGameContext';

const AIvsAI = () => {
  const {
    board,
    currentPlayer,
    uwongPawnsInHand,
    gameState,
    selectedPiece,
    setSelectedPiece,
    message,
    win,
    winner,
    uwongTotal,
    macanPos,
    nodePositions,
    boardRef,
    connections,
    macanJump,
    handleClick,
    renderConnections,
    firstMove,
    // setFirstMove
  } = useMacananGame();

  const [isRunning, setIsRunning] = useState(true);

  const move = () => {
    if (!win && (currentPlayer === 'macan' || currentPlayer === 'uwong') && isRunning) {
      let aiMove;
      if (firstMove.uwong && currentPlayer === 'uwong') {
        aiMove = [null, 12];
      } else if (firstMove.macan && currentPlayer === 'macan') {
        aiMove = [null, 12];
      } else {
        aiMove = getBestMove(board, currentPlayer, connections, macanPos);
      }
      if (aiMove) {
        handleClick(aiMove[1], aiMove[0]);
      }
    }
    console.log('AIvsAI useEffect');
  };

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setTimeout(() => {
        move();
      }, 500);
    }


    return () => clearTimeout(timer);
  }, [isRunning, currentPlayer, win, firstMove]);

  console.log({
    board,
    currentPlayer,
    uwongPawnsInHand,
    gameState,
    selectedPiece,
    message,
    win,
    winner,
    uwongTotal,
    macanPos,
    nodePositions,
    boardRef,
    connections,
    macanJump,
    handleClick,
  })

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
                  className={`w-12 h-12 rounded-full bg-gray-200 relative z-10 ${board[index] === 'uwong' ? 'bg-green-500' :
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
                  className={`w-12 h-12 rounded-full bg-gray-200 relative z-10 ${board[index] === 'uwong' ? 'bg-green-500' :
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
                  className={`w-12 h-12 rounded-full bg-gray-200 relative z-10 ${board[index] === 'uwong' ? 'bg-green-500' :
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
                  className={`w-12 h-12 rounded-full bg-gray-200 relative z-10 ${board[index] === 'uwong' ? 'bg-green-500' :
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
                  className={`w-12 h-12 rounded-full bg-gray-200 relative z-10 ${board[index] === 'uwong' ? 'bg-green-500' :
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
          <button onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIvsAI;
import React, { useState } from 'react';

const MacananGame = () => {
  const [board, setBoard] = useState(Array(36).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('uwong');
  const [uwongPawnsInHand, setUwongPawnsInHand] = useState(21);
  const [gameState, setGameState] = useState('initial');
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [message, setMessage] = useState('Uwong: Click anywhere to place initial 3x3 formation');

  const connections = {
    0: [1, 5, 6],
    1: [0, 2, 6],
    2: [1, 3, 6, 7, 8],
    3: [2, 4, 8],
    4: [3, 8, 9],
    5: [0, 6, 10],
    6: [0, 1, 2, 5, 7, 10, 11, 12],
    7: [2, 6, 8, 12],
    8: [2, 3, 4, 7, 9, 12, 13, 14],
    9: [4, 8, 14],
    10: [5, 6, 11, 15, 16, 26, 28, 30],
    11: [6, 10, 12, 16],
    12: [6, 7, 8, 11, 13, 16, 17, 18],
    13: [8, 12, 14, 18],
    14: [8, 9, 13, 18, 19, 31, 33, 35],
    15: [10, 16, 20],
    16: [10, 11, 12, 15, 17, 20, 21, 22],
    17: [12, 16, 18, 22],
    18: [12, 13, 14, 17, 19, 22, 23, 24],
    19: [14, 18, 24],
    20: [15, 16, 21],
    21: [16, 20, 22],
    22: [16, 17, 18, 21, 23],
    23: [18, 22, 24],
    24: [18, 19, 23],
    25: [26, 27],
    26: [25, 28, 10],
    27: [25, 28, 29],
    28: [26, 27, 10, 30],
    29: [27, 30],
    30: [28, 29, 10],
    31: [14, 32, 33],
    32: [31, 34],
    33: [14, 31, 34, 35],
    34: [32, 33, 36],
    35: [14, 33, 36],
    36: [34, 35]
  };

  const place3x3Formation = (centerPosition) => {
    const newBoard = [...board];
    const row = Math.floor(centerPosition / 5);
    const col = centerPosition % 5;
    
    if (row < 1 || row > 3 || col < 1 || col > 3) {
      setMessage('Invalid position. Choose center position for 3x3 formation');
      return;
    }

    const positions = [
      [(row-1)*5 + (col-1), (row-1)*5 + col, (row-1)*5 + (col+1)],
      [row*5 + (col-1), row*5 + col, row*5 + (col+1)],
      [(row+1)*5 + (col-1), (row+1)*5 + col, (row+1)*5 + (col+1)]
    ];

    positions.flat().forEach(pos => {
      newBoard[pos] = 'uwong';
    });

    setBoard(newBoard);
    setCurrentPlayer('macan');
    setGameState('placing');
    setUwongPawnsInHand(12);
    setMessage('Macan: Place your piece');
  };

  const isValidMove = (from, to) => {
    return connections[from]?.includes(to);
  };

  const canMacanJump = (from, to) => {
    if (board[to] !== null) return false;
    
    const path = findJumpPath(from, to);
    return path !== null && board[path] === 'uwong';
  };

  const findJumpPath = (from, to) => {
    const fromRow = Math.floor(from / 5);
    const fromCol = from % 5;
    const toRow = Math.floor(to / 5);
    const toCol = to % 5;
    
    const midRow = Math.floor((fromRow + toRow) / 2);
    const midCol = Math.floor((fromCol + toCol) / 2);
    const midPos = midRow * 5 + midCol;
    
    if (Math.abs(fromRow - toRow) <= 2 && Math.abs(fromCol - toCol) <= 2) {
      return midPos;
    }
    return null;
  };

  const handleClick = (position) => {
    if (gameState === 'initial') {
      place3x3Formation(position);
    } else if (gameState === 'placing') {
      if (currentPlayer === 'macan' && board[position] === null) {
        const newBoard = [...board];
        newBoard[position] = 'macan';
        setBoard(newBoard);
        setCurrentPlayer('uwong');
        setGameState('moving');
        setMessage('Uwong: Place remaining pawns or move existing ones');
      } else if (currentPlayer === 'uwong' && board[position] === null && uwongPawnsInHand > 0) {
        const newBoard = [...board];
        newBoard[position] = 'uwong';
        setBoard(newBoard);
        setUwongPawnsInHand(prev => prev - 1);
        setCurrentPlayer('macan');
        setMessage('Macan: Your turn');
      }
    } else if (gameState === 'moving') {
      if (selectedPiece === null) {
        if (board[position] === currentPlayer) {
          setSelectedPiece(position);
          setMessage(`Selected piece at position ${position}`);
        }
      } else {
        if (currentPlayer === 'macan') {
          if (isValidMove(selectedPiece, position) || canMacanJump(selectedPiece, position)) {
            const newBoard = [...board];
            newBoard[selectedPiece] = null;
            newBoard[position] = 'macan';
            
            if (canMacanJump(selectedPiece, position)) {
              const jumpedPos = findJumpPath(selectedPiece, position);
              newBoard[jumpedPos] = null;
            }
            
            setBoard(newBoard);
            setCurrentPlayer('uwong');
            setMessage('Uwong: Your turn');
          }
        } else if (currentPlayer === 'uwong') {
          if (isValidMove(selectedPiece, position) && board[position] === null) {
            const newBoard = [...board];
            newBoard[selectedPiece] = null;
            newBoard[position] = 'uwong';
            setBoard(newBoard);
            setCurrentPlayer('macan');
            setMessage('Macan: Your turn');
          }
        }
        setSelectedPiece(null);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="text-xl font-bold mb-4">{message}</div>
      <div className="flex justify-center items-center gap-8">
        {/* Left Wing (Positions 25–30) */}
        <div className="grid grid-cols-1 gap-20">
            {[25, 27, 29].map((index) => (
              <button
                key={index}
                className={`w-12 h-12 rounded-full ${
                  board[index] === 'uwong' ? 'bg-green-500' :
                  board[index] === 'macan' ? 'bg-red-500' :
                  'bg-gray-200'
                }`}
                onClick={() => handleClick(index)}
              />
            ))}
        </div>
        <div className="grid grid-cols-1 gap-4">
            {[26, 28, 30].map((index) => (
              <button
                key={index}
                className={`w-12 h-12 rounded-full ${
                  board[index] === 'uwong' ? 'bg-green-500' :
                  board[index] === 'macan' ? 'bg-red-500' :
                  'bg-gray-200'
                }`}
                onClick={() => handleClick(index)}
              />
            ))}
        </div>

        {/* Main 5x5 Grid (Positions 0–24) */}
        <div className="grid grid-cols-5 gap-4">
          {board.slice(0, 25).map((piece, index) => (
            <button
              key={index}
              className={`w-12 h-12 rounded-full ${
                selectedPiece === index ? 'ring-2 ring-blue-500' : ''
              } ${
                piece === 'uwong' ? 'bg-green-500' :
                piece === 'macan' ? 'bg-red-500' :
                'bg-gray-200'
              }`}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>

        {/* Right Wing (Positions 31–36) */}
        <div className="grid grid-cols-1 gap-4">
          {[31, 33, 35].map((index) => (
            <button
              key={index}
              className={`w-12 h-12 rounded-full ${
                board[index] === 'uwong' ? 'bg-green-500' :
                board[index] === 'macan' ? 'bg-red-500' :
                'bg-gray-200'
              }`}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-20">
          {[32, 34, 36].map((index) => (
            <button
              key={index}
              className={`w-12 h-12 rounded-full ${
                board[index] === 'uwong' ? 'bg-green-500' :
                board[index] === 'macan' ? 'bg-red-500' :
                'bg-gray-200'
              }`}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>
      </div>
      <div className="mt-4">
        {uwongPawnsInHand > 0 && (
          <div className="text-sm">Remaining Uwong pawns: {uwongPawnsInHand}</div>
        )}
      </div>
    </div>
  );
};

export default MacananGame;
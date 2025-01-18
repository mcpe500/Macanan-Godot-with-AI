import React, { useState, useEffect, useRef } from 'react';

const AIvsAI = () => {
  const [board, setBoard] = useState(Array(37).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('uwong');
  const [uwongPawnsInHand, setUwongPawnsInHand] = useState(21);
  const [gameState, setGameState] = useState('initial');
  const [message, setMessage] = useState('AI Uwong: Placing initial 3x3 formation');
  const [win, setWin] = useState(false);
  const [winner, setWinner] = useState(null);
  const [uwongTotal, setUwongTotal] = useState(21);
  const [macanPos, setMacanPos] = useState(null);
  const [nodePositions, setNodePositions] = useState({});
  const [isSimulating, setIsSimulating] = useState(false);
  const [moveDelay] = useState(1000); // 1 second delay between moves
  const boardRef = useRef(null);

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

  const macanJump = {
    0: { 2: [1], 10: [5] },
    1: { 3: [2], 11: [6] },
    2: { 0: [1], 4: [3], 12: [7] },
    3: { 1: [2], 13: [8] },
    4: { 2: [3], 14: [9] },
    5: { 15: [10], 7: [6] },
    6: { 16: [11], 8: [7] },
    7: { 17: [12], 5: [6] },
    8: { 18: [13], 6: [7] },
    9: { 19: [14], 7: [8] },
    10: { 20: [15], 0: [5] },
    11: { 21: [16], 1: [6] },
    12: { 22: [17], 2: [7] },
    13: { 23: [18], 3: [8] },
    14: { 24: [19], 4: [9] },
    15: { 25: [20], 5: [10] },
    16: { 26: [21], 6: [11] },
    17: { 27: [22], 7: [12] },
    18: { 28: [23], 8: [13] },
    19: { 29: [24], 9: [14] },
    20: { 30: [25], 10: [15] },
    21: { 31: [26], 11: [16] },
    22: { 32: [27], 12: [17] },
    23: { 33: [28], 13: [18] },
    24: { 34: [29], 14: [19] }
  };

  const evaluateBoard = (tempBoard, player) => {
    let score = 0;
    
    // Count pieces
    const uwongCount = tempBoard.filter(cell => cell === 'uwong').length;
    const macanCount = tempBoard.filter(cell => cell === 'macan').length;
    
    if (player === 'uwong') {
      // Uwong strategy: maintain pieces and surround Macan
      score += uwongCount * 10;
      // Bonus for pieces near Macan
      const macanIndex = tempBoard.findIndex(cell => cell === 'macan');
      if (macanIndex !== -1) {
        connections[macanIndex].forEach(pos => {
          if (tempBoard[pos] === 'uwong') score += 5;
        });
      }
    } else {
      // Macan strategy: capture Uwong pieces
      score -= uwongCount * 10;
      // Bonus for having more capture opportunities
      Object.keys(macanJump).forEach(from => {
        if (tempBoard[from] === 'macan') {
          Object.keys(macanJump[from]).forEach(to => {
            if (!tempBoard[to]) score += 3;
          });
        }
      });
    }
    
    return score;
  };

  const minimax = (depth, isMaximizing, tempBoard, player, alpha = -Infinity, beta = Infinity) => {
    if (depth === 0) {
      return evaluateBoard(tempBoard, player);
    }

    if (isMaximizing) {
      let maxScore = -Infinity;
      const moves = getAvailableMoves(tempBoard, player);
      
      for (const move of moves) {
        const newBoard = [...tempBoard];
        makeMove(newBoard, move, player);
        const score = minimax(depth - 1, false, newBoard, player, alpha, beta);
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break;
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      const moves = getAvailableMoves(tempBoard, player === 'uwong' ? 'macan' : 'uwong');
      
      for (const move of moves) {
        const newBoard = [...tempBoard];
        makeMove(newBoard, move, player === 'uwong' ? 'macan' : 'uwong');
        const score = minimax(depth - 1, true, newBoard, player, alpha, beta);
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break;
      }
      return minScore;
    }
  };

  const getAvailableMoves = (tempBoard, player) => {
    const moves = [];

    if (player === 'uwong') {
      if (gameState === 'initial') {
        // Get valid 3x3 formation positions
        for (let i = 0; i < 37; i++) {
          if (!tempBoard[i]) {
            const row = Math.floor(i / 5);
            const col = i % 5;
            if (row >= 1 && row <= 3 && col >= 1 && col <= 3) {
              moves.push({ type: 'place3x3', position: i });
            }
          }
        }
      } else if (gameState === 'placing') {
        // Get empty positions for placing remaining pawns
        tempBoard.forEach((cell, i) => {
          if (!cell) moves.push({ type: 'place', position: i });
        });
      } else {
        // Get valid moves for existing Uwong pieces
        tempBoard.forEach((cell, i) => {
          if (cell === 'uwong') {
            connections[i].forEach(to => {
              if (!tempBoard[to]) moves.push({ type: 'move', from: i, to });
            });
          }
        });
      }
    } else {
      // Macan moves
      tempBoard.forEach((cell, i) => {
        if (cell === 'macan') {
          // Regular moves
          connections[i].forEach(to => {
            if (!tempBoard[to]) moves.push({ type: 'move', from: i, to });
          });
          
          // Jump moves
          Object.keys(macanJump[i] || {}).forEach(to => {
            if (!tempBoard[to] && canMacanJump(i, parseInt(to), tempBoard)) {
              moves.push({ type: 'jump', from: i, to: parseInt(to) });
            }
          });
        }
      });
    }

    return moves;
  };

  const makeMove = (tempBoard, move, player) => {
    if (player === 'uwong') {
      if (move.type === 'place3x3') {
        const row = Math.floor(move.position / 5);
        const col = move.position % 5;
        const positions = [
          [(row-1)*5 + (col-1), (row-1)*5 + col, (row-1)*5 + (col+1)],
          [row*5 + (col-1), row*5 + col, row*5 + (col+1)],
          [(row+1)*5 + (col-1), (row+1)*5 + col, (row+1)*5 + (col+1)]
        ];
        positions.flat().forEach(pos => {
          tempBoard[pos] = 'uwong';
        });
      } else if (move.type === 'place') {
        tempBoard[move.position] = 'uwong';
      } else {
        tempBoard[move.from] = null;
        tempBoard[move.to] = 'uwong';
      }
    } else {
      tempBoard[move.from] = null;
      tempBoard[move.to] = 'macan';
      
      if (move.type === 'jump') {
        const path = findJumpPath(move.from, move.to);
        path?.forEach(pos => {
          tempBoard[pos] = null;
        });
      }
    }
  };

  const findBestMove = (tempBoard, player) => {
    const moves = getAvailableMoves(tempBoard, player);
    let bestScore = player === 'uwong' ? -Infinity : Infinity;
    let bestMove = null;

    for (const move of moves) {
      const newBoard = [...tempBoard];
      makeMove(newBoard, move, player);
      const score = minimax(3, player === 'uwong', newBoard, player);
      
      if (player === 'uwong' && score > bestScore) {
        bestScore = score;
        bestMove = move;
      } else if (player === 'macan' && score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  };

  const canMacanJump = (from, to, tempBoard) => {
    if (tempBoard[to] !== null) return false;
    const path = findJumpPath(from, to);
    if (!path) return false;
    return path.every(p => tempBoard[p] === "uwong");
  };

  const findJumpPath = (from, to) => {
    return macanJump[from]?.[to];
  };

  useEffect(() => {
    if (!win && !isSimulating) {
      setIsSimulating(true);
      setTimeout(() => {
        const move = findBestMove(board, currentPlayer);
        if (move) {
          const newBoard = [...board];
          makeMove(newBoard, move, currentPlayer);
          setBoard(newBoard);
          
          if (currentPlayer === 'uwong') {
            if (gameState === 'initial') {
              setGameState('placing');
              setUwongPawnsInHand(12);
              setCurrentPlayer('macan');
              setMessage('AI Macan: Making a move');
            } else {
              setCurrentPlayer('macan');
              setMessage('AI Macan: Making a move');
            }
          } else {
            setCurrentPlayer('uwong');
            if (uwongPawnsInHand > 0) {
              setGameState('placing');
              setMessage('AI Uwong: Placing remaining pawns');
            } else {
              setGameState('moving');
              setMessage('AI Uwong: Moving existing pieces');
            }
          }
        }
        setIsSimulating(false);
      }, moveDelay);
    }
  }, [board, currentPlayer, gameState, win, isSimulating]);

  useEffect(() => {
    const canMacanMove = (from) => {
      const walk = connections[from];
      const jump = macanJump[from];
      
      for (const w of walk) {
        if(board[w] !== "uwong"){
          return true
        }
      }

      for (const key in jump) {
        if (Object.prototype.hasOwnProperty.call(jump, key)) {
          let value = jump[key];
          let adaMusuh = true;

          for (const wong of value) {
            if(board[wong] != "uwong"){
              adaMusuh = false;
            }
          }

          if(adaMusuh){
            if(board[key] != "uwong"){
              return true;
            }
          }
        }
      }
      return false;
    }

    if (currentPlayer === 'uwong' && uwongTotal < 14) {
      setWin(true);
      setWinner('macan');
      setMessage('Macan Wins!');
    }

    if (macanPos !== null) {
      if (!canMacanMove(macanPos)) {
        setWin(true);
        setWinner('uwong');
        setMessage('Uwong Wins!');
      }
    }
  }, [currentPlayer, uwongTotal, macanPos, board]);

  const calculateNodePositions = () => {
    if (boardRef.current) {
      const buttons = boardRef.current.querySelectorAll('button');
      buttons.forEach(button => {
        const position = button.getAttribute('data-position');
        const rect = button.getBoundingClientRect();
        setNodePositions(prev => ({
          ...prev,
          [position]: {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          }
        }));
      });
    }
  };

  useEffect(() => {
    calculateNodePositions();
    window.addEventListener('resize', calculateNodePositions);
    document.addEventListener('visibilitychange', calculateNodePositions);

    const timeout = setTimeout(calculateNodePositions, 100);

    return () => {
      window.removeEventListener('resize', calculateNodePositions);
      document.removeEventListener('visibilitychange', calculateNodePositions);
      clearTimeout(timeout);
    };
  }, [board]);

  const renderConnections = () => {
    const lines = [];
    
    Object.entries(connections).forEach(([from, tos]) => {
      tos.forEach((to) => {
        if (nodePositions[from] && nodePositions[to] && from !== to) {
          lines.push(
            <line
              key={`${from}-${to}`}
              x1={nodePositions[from].x}
              y1={nodePositions[from].y}
              x2={nodePositions[to].x}
              y2={nodePositions[to].y}
              stroke="#CBD5E0"
              strokeWidth="2"
            />
          );
        }
      });
    });
    
    return lines;
  };

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
                  className={`w-12 h-12 rounded-full bg-gray-200 relative z-10 ${
                    board[index] === 'uwong' ? 'bg-green-500' :
                    board[index] === 'macan' ? 'bg-red-500' :
                    'bg-gray-200'
                  }`}
                >{index}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[26, 28, 30].map((index) => (
                <button
                  key={index}
                  data-position={index}
                  className={`w-12 h-12 rounded-full bg-gray-200 relative z-10 ${
                    board[index] === 'uwong' ? 'bg-green-500' :
                    board[index] === 'macan' ? 'bg-red-500' :
                    'bg-gray-200'
                  }`}
                >{index}</button>
              ))}
            </div>

            {/* Main 5x5 Grid */}
            <div className="grid grid-cols-5 gap-4">
              {Array(25).fill(null).map((_, index) => (
                <button
                  key={index}
                  data-position={index}
                  className={`w-12 h-12 rounded-full bg-gray-200 relative z-10 ${
                    board[index] === 'uwong' ? 'bg-green-500' :
                    board[index] === 'macan' ? 'bg-red-500' :
                    'bg-gray-200'
                  }`}
                >{index}</button>
              ))}
            </div>

            {/* Right Wing */}
            <div className="grid grid-cols-1 gap-4">
              {[31, 33, 35].map((index) => (
                <button
                  key={index}
                  data-position={index}
                  className={`w-12 h-12 rounded-full bg-gray-200 relative z-10 ${
                    board[index] === 'uwong' ? 'bg-green-500' :
                    board[index] === 'macan' ? 'bg-red-500' :
                    'bg-gray-200'
                  }`}
                >{index}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-20">
              {[32, 34, 36].map((index) => (
                <button
                  key={index}
                  data-position={index}
                  className={`w-12 h-12 rounded-full bg-gray-200 relative z-10 ${
                    board[index] === 'uwong' ? 'bg-green-500' :
                    board[index] === 'macan' ? 'bg-red-500' :
                    'bg-gray-200'
                  }`}
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
          {winner && <div className="text-2xl font-bold text-center mt-4">{winner} wins!</div>}
        </div>
      </div>
    </div>
  );
};

export default AIvsAI;
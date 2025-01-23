import {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router';
import MacananUAI from './MacananUAI';

const HumanVsAIUwong = () => {
  const [board, setBoard] = useState(Array(37).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('uwong');
  const [uwongPawnsInHand, setUwongPawnsInHand] = useState(21);
  const [gameState, setGameState] = useState('initial');
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [message, setMessage] = useState('Uwong: Click anywhere to place initial 3x3 formation');
  const [win, setWin] = useState(false);
  const [winner, setWinner] = useState(null);
  const [uwongTotal, setUwongTotal] = useState(21);
  const [macanPos, setMacanPos] = useState(null); // Initialize to null
  const [nodePositions, setNodePositions] = useState({});
  const [isAIThinking, setIsAIThinking] = useState(false);
  const boardRef = useRef(null);
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/');
  };

  const restartGame = () => {
    setBoard(Array(37).fill(null));
    setCurrentPlayer('uwong');
    setUwongPawnsInHand(21);
    setGameState('initial');
    setSelectedPiece(null);
    setMessage('Uwong: Click anywhere to place initial 3x3 formation');
    setWin(false);
    setWinner(null);
    setUwongTotal(21);
    setMacanPos(null); // Reset macanPos to null
    setNodePositions({});
  };

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
    0: {
      2: [1],
      4: [1, 2, 3],
      12: [6],
      24: [6, 12, 18],
      10: [5],
      20: [5, 10, 15]
    },
    1: {
      3: [2],
      11: [6],
      21: [6, 11, 16]
    },
    2: {
      4: [3],
      14: [8],
      36: [8, 14, 35],
      12: [7],
      22: [7, 12, 17],
      10: [6],
      29: [6, 10, 30],
      0: [1]
    },
    3: {
      13: [8],
      23: [8, 13, 18],
      1: [2]
    },
    4: {
      14: [9],
      24: [9, 14, 19],
      12: [8],
      20: [8, 12, 16],
      2: [3],
      0: [3, 2, 1]
    },
    5: {
      7: [6],
      9: [6, 7, 8],
      15: [10]
    },
    6: {
      8: [7],
      18: [12],
      16: [11],
      30: [10]
    },
    7: {
      9: [8],
      17: [12],
      5: [6]
    },
    8: {
      35: [14],
      18: [13],
      16: [12],
      6: [7]
    },
    9: {
      19: [14],
      7: [8],
      5: [8, 7, 6]
    },
    10: {
      12: [11],
      14: [11, 12, 13],
      34: [11, 12, 13, 14, 33],
      22: [16],
      20: [15],
      29: [30],
      27: [28],
      25: [26],
      0: [5],
      2: [6]
    },
    11: {
      13: [12],
      33: [12, 13, 14],
      21: [16],
      28: [10],
      1: [6]
    },
    12: {
      14: [13],
      34: [13, 14, 33],
      24: [18],
      22: [17],
      20: [16],
      10: [11],
      27: [11, 10, 28],
      0: [6],
      2: [7],
      4: [8]
    },
    13: {
      33: [14],
      23: [18],
      11: [12],
      28: [12, 11, 10],
      3: [8]
    },
    14: {
      34: [33],
      36: [35],
      24: [19],
      22: [18],
      12: [13],
      10: [13, 12, 11],
      27: [13, 12, 11, 10, 28],
      2: [8],
      4: [9],
      32: [31]
    },
    15: {
      17: [16],
      19: [16, 17, 18],
      5: [10]
    },
    16: {
      18: [17],
      26: [10],
      6: [11],
      8: [12]
    },
    17: {
      19: [18],
      15: [16],
      7: [12]
    },
    18: {
      16: [17],
      6: [12],
      8: [13],
      31: [14]
    },
    19: {
      17: [18],
      15: [18, 17, 16],
      9: [14]
    },
    20: {
      22: [21],
      24: [21, 22, 23],
      10: [15],
      0: [15, 10, 5],
      12: [16],
      4: [16, 12, 8]
    },
    21: {
      23: [22],
      11: [16],
      1: [16, 11, 6]
    },
    22: {
      24: [23],
      20: [21],
      10: [16],
      25: [16, 10, 26],
      12: [17],
      2: [17, 12, 7],
      14: [18],
      32: [18, 14, 31]
    },
    23: {
      21: [22],
      13: [18],
      3: [18, 13, 8]
    },
    24: {
      22: [23],
      20: [23, 22, 21],
      12: [18],
      0: [18, 12, 6],
      14: [19],
      4: [19, 14, 9]
    },
    25: {
      10: [26],
      22: [26, 10, 16],
      29: [27]
    },
    26: {
      16: [10],
      30: [28]
    },
    27: {
      10: [28],
      12: [28, 10, 11],
      14: [28, 10, 11, 12, 13],
      34: [28, 10, 11, 12, 13, 14, 33]
    },
    28: {
      11: [10],
      13: [10, 11, 12],
      33: [10, 11, 12, 13, 14]
    },
    29: {
      25: [27],
      10: [30],
      2: [30, 10, 6]
    },
    30: {
      26: [28],
      6: [10]
    },
    31: {
      35: [33],
      18: [14]
    },
    32: {
      36: [34],
      14: [31],
      22: [31, 14, 18]
    },
    33: {
      13: [14],
      11: [14, 13, 12],
      28: [14, 13, 12, 11, 10]
    },
    34: {
      14: [33],
      12: [33, 14, 13],
      10: [33, 14, 13, 12, 11],
      27: [33, 14, 13, 12, 11, 10, 28]
    },
    35: {
      8: [14],
      31: [33]
    },
    36: {
      14: [35],
      2: [35, 14, 8],
      32: [34]
    }
  }

  // // Add useEffect for AI moves
  // useEffect(() => {
  //   if (currentPlayer === 'uwong' && !win && !isAIThinking) {
  //     setIsAIThinking(true);

  //     // Small delay to make AI moves feel more natural
  //     setTimeout(() => {
  //       if (gameState === 'initial') {
  //         // AI places initial formation in a good position (center)
  //         place3x3Formation(12); // Center position
  //       } else if (gameState === 'placing') {
  //         // AI places remaining pawns
  //         const bestMove = MacananUAI.getBestMove(board, uwongTotal, connections, macanPos, macanJump);
  //         const validEmptySpots = Array(37).fill().map((_, i) => i).filter(i => board[i] === null);
  //         const randomSpot = validEmptySpots[Math.floor(Math.random() * validEmptySpots.length)];

  //         const newBoard = [...board];
  //         newBoard[randomSpot] = 'uwong';
  //         setBoard(newBoard);
  //         setUwongPawnsInHand(prev => prev - 1);
  //         setCurrentPlayer('macan');
  //         setGameState('moving');
  //         setMessage('Macan: Move or eat Uwong piece(s)');
  //       } else if (gameState === 'moving') {
  //         // AI moves existing pawns
  //         const bestMove = MacananUAI.getBestMove(board, uwongTotal, connections, macanPos, macanJump);
  //         if (bestMove) {
  //           const newBoard = [...board];
  //           newBoard[bestMove.from] = null;
  //           newBoard[bestMove.to] = 'uwong';
  //           setBoard(newBoard);
  //           setCurrentPlayer('macan');
  //           setGameState('moving');
  //           setMessage('Macan: Move or eat Uwong piece(s)');
  //         }
  //       }
  //       setIsAIThinking(false);
  //     }, 500);
  //   }
  // }, [currentPlayer, gameState, win]);

  useEffect(() => {
    if (currentPlayer === 'uwong' && !win && !isAIThinking) {
      setIsAIThinking(true);

      setTimeout(() => {
        if (gameState === 'initial') {
          // AI places initial formation in a good position (center)
          const validCenter = [6, 7, 8, 11, 12, 13, 16, 17, 18];
          const centerPosition = validCenter[Math.floor(Math.random() * validCenter.length)];
          place3x3Formation(centerPosition); // Center position
        } else if (gameState === 'placing' && uwongPawnsInHand > 0) {
          // AI places remaining pawns
          const validEmptySpots = Array(37)
            .fill()
            .map((_, i) => i)
            .filter(i => board[i] === null);

          // Pick a strategic spot using the evaluation function
          let bestScore = -Infinity;
          let bestSpot = validEmptySpots[0];

          for (const spot of validEmptySpots) {
            const testBoard = [...board];
            testBoard[spot] = 'uwong';
            const score = MacananUAI.evaluateBoard(testBoard, uwongTotal + 1, connections, macanPos, macanJump);

            if (score > bestScore) {
              bestScore = score;
              bestSpot = spot;
            }
          }

          const newBoard = [...board];
          newBoard[bestSpot] = 'uwong';
          setBoard(newBoard);
          setUwongPawnsInHand(prev => prev - 1);
          setCurrentPlayer('macan');
          setGameState('moving');
          setMessage('Macan: Move or eat Uwong piece(s)');
        } else if (gameState === 'moving' && uwongPawnsInHand === 0) {
          // Only move pieces after all pawns are placed
          const bestMove = MacananUAI.getBestMove(board, uwongTotal, connections, macanPos, macanJump);
          if (bestMove) {
            const newBoard = [...board];
            newBoard[bestMove.from] = null;
            newBoard[bestMove.to] = 'uwong';
            setBoard(newBoard);
            setCurrentPlayer('macan');
            setMessage('Macan: Move or eat Uwong piece(s)');
          }
        }
        setIsAIThinking(false);
      }, 500);
    }
  }, [currentPlayer, gameState, win]);

  // Updated useEffect to handle window resize and page refresh
  useEffect(() => {
    const calculateNodePositions = () => {
      if (boardRef.current) {
        const positions = {};
        const nodes = boardRef.current.getElementsByTagName('button');

        // Wait for next frame to ensure DOM is fully rendered
        requestAnimationFrame(() => {
          Array.from(nodes).forEach((node) => {
            const rect = node.getBoundingClientRect();
            const boardRect = boardRef.current.getBoundingClientRect();
            positions[node.dataset.position] = {
              x: rect.left - boardRect.left + rect.width / 2,
              y: rect.top - boardRect.top + rect.height / 2
            };
          });

          setNodePositions(positions);
        });
      }
    };

    // Initial calculation
    calculateNodePositions();

    // Add resize event listener
    window.addEventListener('resize', calculateNodePositions);

    // Add visibility change listener for when page becomes visible again
    document.addEventListener('visibilitychange', calculateNodePositions);

    // Recalculate positions after a short delay to ensure all elements are properly rendered
    const timeout = setTimeout(calculateNodePositions, 100);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', calculateNodePositions);
      document.removeEventListener('visibilitychange', calculateNodePositions);
      clearTimeout(timeout);
    };
  }, [board]); // Added board as dependency to recalculate when game state changes

  // Check macan player condition for win
  useEffect(() => {
    const canMacanMove = (from) => {
      if (from === null || !macanJump[from]) return false; // Validate from position

      const walk = connections[from];
      const jump = macanJump[from];

      for (const w of walk) {
        if (board[w] !== "uwong") {
          return true;
        }
      }

      for (const key in jump) {
        if (Object.prototype.hasOwnProperty.call(jump, key)) {
          const value = jump[key];
          let adaMusuh = true;

          for (const wong of value) {
            if (board[wong] !== "uwong") {
              adaMusuh = false;
            }
          }

          if (adaMusuh && board[key] !== "uwong") {
            return true;
          }
        }
      }

      return false;
    };

    if (uwongTotal < 14) {
      setWin(true);
      setWinner("macan");
      setMessage("Macan Win!");
    }

    if (macanPos !== null && !canMacanMove(macanPos)) {
      setWin(true);
      setWinner("uwong");
      setMessage("Uwong Win!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlayer, uwongTotal, macanPos, board, connections]);

  const renderConnections = () => {
    const lines = [];

    Object.entries(connections).forEach(([from, tos]) => {
      tos.forEach((to) => {
        // Only render if both positions exist and are different
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

  const place3x3Formation = (centerPosition) => {
    const newBoard = [...board];
    const row = Math.floor(centerPosition / 5);
    const col = centerPosition % 5;

    if (row < 1 || row > 3 || col < 1 || col > 3) {
      setMessage('Invalid position. Choose center position for 3x3 formation');
      return;
    }

    const positions = [
      [(row - 1) * 5 + (col - 1), (row - 1) * 5 + col, (row - 1) * 5 + (col + 1)],
      [row * 5 + (col - 1), row * 5 + col, row * 5 + (col + 1)],
      [(row + 1) * 5 + (col - 1), (row + 1) * 5 + col, (row + 1) * 5 + (col + 1)]
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

  // Validate macanPos before accessing macanJump
  const canMacanJump = (from, to) => {
    if (board[to] !== null) return false;

    // Validate from and to positions
    if (from === null || to === null || !macanJump[from] || !macanJump[from][to]) {
      return false;
    }

    const path = macanJump[from][to];

    if (path == null) return false;

    let eat = true;
    for (const p of path) {
      if (board[p] !== "uwong") {
        eat = false;
      }
    }

    return eat;
  };

  const findJumpPath = (from, to) => {
    const listJump = macanJump[from];
    const path = listJump[to];

    return path;
  };

  // Modified handleClick to validate macanPos
  const handleClick = (position) => {
    if (!win && currentPlayer === 'macan') {
      if (gameState === 'placing') {
        if (board[position] === null) {
          const newBoard = [...board];
          newBoard[position] = 'macan';
          setMacanPos(position); // Set macanPos to the new position
          setBoard(newBoard);
          setCurrentPlayer('uwong');
          if (uwongPawnsInHand > 0) {
            setGameState('placing');
            setMessage('Uwong: Place remaining pawns');
          } else {
            setGameState('moving');
            setMessage('Uwong: Move existing ones');
          }
        } else {
          setMessage("Macan: Choose an empty place");
        }
      } else if (gameState === 'moving') {
        if (board[position] !== null) {
          if (board[position] === currentPlayer) {
            setSelectedPiece(position);
            setMessage(`Macan: Selected piece at position ${position}`);
          }
        } else if (selectedPiece !== null) {
          if ((isValidMove(selectedPiece, position) || canMacanJump(selectedPiece, position))) {
            const newBoard = [...board];
            newBoard[selectedPiece] = null;
            newBoard[position] = 'macan';

            if (canMacanJump(selectedPiece, position)) {
              const jumpedPos = macanJump[selectedPiece][position];
              for (const p of jumpedPos) {
                newBoard[p] = null;
                setUwongTotal(prev => prev - 1);
              }
            }

            setBoard(newBoard);
            setMacanPos(position); // Update macanPos to the new position
            setCurrentPlayer('uwong');
            if (uwongPawnsInHand > 0) {
              setGameState('placing');
              setMessage('Uwong: Place remaining pawns');
            } else {
              setGameState('moving');
              setMessage('Uwong: Move existing ones');
            }
            setSelectedPiece(null);
          }
        }
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="relative w-full max-w-4xl mx-auto" ref={boardRef}>
        <svg className="absolute w-full h-full pointer-events-none">
          {renderConnections()}
        </svg>
        <div className="flex flex-col items-center gap-4">
          <div className="text-xl font-bold text-center">
            {isAIThinking ? "AI is thinking..." : message}
          </div>
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
                  onClick={() => handleClick(index)}
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
                  className={`w-12 h-12 rounded-full bg-gray-200 relative z-10 ${
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
                  className={`w-12 h-12 rounded-full bg-gray-200 relative z-10 ${
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
                  className={`w-12 h-12 rounded-full bg-gray-200 relative z-10 ${
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

export default HumanVsAIUwong;
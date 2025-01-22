// MacananGameContext.js
import { createContext, useContext, useState, useEffect, useRef } from 'react';

const MacananGameContext = createContext();

export const MacananGameProvider = ({ children }) => {
  const [board, setBoard] = useState(Array(37).fill(null)); // butuh di pass baru ke minimax
  const [currentPlayer, setCurrentPlayer] = useState('uwong');
  const [uwongPawnsInHand, setUwongPawnsInHand] = useState(21); // butuh di pass baru ke minimax
  const [gameState, setGameState] = useState('initial'); // butuh di pass baru ke minimax
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [message, setMessage] = useState('Uwong: Click anywhere to place initial 3x3 formation');
  const [win, setWin] = useState(false);
  const [winner, setWinner] = useState(null);
  const [uwongTotal, setUwongTotal] = useState(21); // butuh di pass baru ke minimax
  const [macanPos, setMacanPos] = useState(null); // setelah dipikir pikir ini buat apa kalau macan pos disimpan di board juga?
  const [nodePositions, setNodePositions] = useState({}); // ini buat rendering
  const boardRef = useRef(null); // ini buat rendering
  const [firstMove, setFirstMove] = useState({ uwong: true, macan: false }); // buat apa ini anjir?


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
    setFirstMove({ ...firstMove, uwong: false });
  };

  const isValidMove = (from, to) => {
    return connections[from]?.includes(to);
  };

  const canMacanJump = (from, to) => {
    if (board[to] !== null) return false;

    const path = findJumpPath(from, to);
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

  // Updated canMacanMoveCounter to accept board as parameter (done)
  const canMacanMoveCounter = (from, board) => {
    let ctr = 0;
    const walk = connections[from];

    // Count walk moves (done)
    walk.forEach(neighbor => {
      if (board[neighbor] === null) ctr++;
    });

    // Count jump moves (done)
    const jumpPaths = macanJump[from];
    for (const targetPos in jumpPaths) {
      const path = jumpPaths[targetPos];
      const allUwong = path.every(pos => board[pos] === 'uwong');
      if (board[targetPos] === null && allUwong) ctr++;
    }

    return ctr;
  };

  const canMacanWalkCounter = (from) => { // (not done)
    let ctr = 0;
    const walk = connections[from];

    // for checking the current node to neighbour node (not done)
    for (const w of walk) {
      if (board[w] !== "uwong") {
        ctr += 1;
      }
    }

    return ctr;
  }

  const canMacanJumpCounter = (from) => { // (not done)
    const jump = macanJump[from];

    for (const key in jump) {
      if (Object.prototype.hasOwnProperty.call(jump, key)) {
        let value = jump[key];
        let adaMusuh = true;

        for (const wong of value) {
          if (board[wong] != "uwong") {
            adaMusuh = false;
          }
        }

        if (adaMusuh) {
          if (board[key] != "uwong") {
            ctr += 1;
          }
        }
      }
    }

    return ctr;
  }

  const handleClick = (position) => {
    if (!win) {
      if (gameState === 'initial') {
        place3x3Formation(position);
      } else if (gameState === 'placing') {
        if (currentPlayer === 'macan') {
          if (board[position] === null) {
            const newBoard = [...board];
            newBoard[position] = 'macan';
            setMacanPos(position);
            setBoard(newBoard);
            setCurrentPlayer('uwong');
            if (uwongPawnsInHand > 0) {
              setGameState('placing');
              setMessage('Uwong: Place remaining pawns');
            } else {
              setGameState('moving');
              setMessage('Uwong: Move existing ones');
            }
            setFirstMove({ ...firstMove, macan: false });
          } else {
            setMessage("Macan: Choose an empty place");
          }
        } else if (currentPlayer === 'uwong') {
          if (board[position] === null) {
            const newBoard = [...board];
            newBoard[position] = 'uwong';
            setBoard(newBoard);
            setUwongPawnsInHand(prev => prev - 1);
            setCurrentPlayer('macan');
            setGameState('moving');
            setMessage('Macan: Move or eat Uwong piece(s)');
          } else {
            setMessage("Uwong: Choose an empty place");
          }
        }
      } else if (gameState === 'moving') {
        if (board[position] !== null) {
          if (board[position] === currentPlayer) {
            setSelectedPiece(position);
            setMessage(`${currentPlayer}: Selected piece at position ${position}`);
          }
        } else {
          if (selectedPiece !== null) {
            if (currentPlayer === 'macan') {
              if ((isValidMove(selectedPiece, position) || canMacanJump(selectedPiece, position))) {
                const newBoard = [...board];
                newBoard[selectedPiece] = null;
                newBoard[position] = 'macan';

                if (canMacanJump(selectedPiece, position)) {
                  const jumpedPos = findJumpPath(selectedPiece, position);
                  for (const p of jumpedPos) {
                    newBoard[p] = null;
                    setUwongTotal(prev => prev - 1);
                  }
                }

                setBoard(newBoard);
                setMacanPos(position);
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
            } else if (currentPlayer === 'uwong') {
              if (isValidMove(selectedPiece, position)) {
                const newBoard = [...board];
                newBoard[selectedPiece] = null;
                newBoard[position] = 'uwong';
                setBoard(newBoard);
                setCurrentPlayer('macan');
                setGameState('moving');
                setMessage('Macan: Move or eat Uwong piece(s)');
                setSelectedPiece(null);
              }
            }
          }
        }
      }
    }
  };

  // Helper functions for move generation (done)
  const generateMacanMoves = (currentPos, board) => { // (done)
    const moves = []; // (done)

    // Generate normal moves (done)
    connections[currentPos].forEach(neighbor => { // (done)
      if (board[neighbor] === null) { // (done)
        moves.push({ // (done)
          position: neighbor, // (done)
          captured: [], // (done)
          isJump: false // (done)
        });
      }
    });

    // Generate jump moves (done)
    const jumpPaths = macanJump[currentPos]; // (done)
    for (const targetPos in jumpPaths) { // (done)
      const path = jumpPaths[targetPos]; // (done)
      const allUwong = path.every(pos => board[pos] === 'uwong'); // (done)
      if (board[targetPos] === null && allUwong) { // (done)
        moves.push({ // (done)
          position: parseInt(targetPos), // (done)
          captured: path, // (done)
          isJump: true // (done)
        });
      }
    }

    return moves; // (done)
  };

  const generateUwongMoves = (board, uwongPawnsInHand, gameState) => { // (done)
    const moves = []; // (done)

    if (gameState === 'placing') { // (done)
      // Generate all empty positions for placing pawns (done)
      board.forEach((cell, index) => { // (done)
        if (cell === null) { // (done)
          moves.push({ position: index }); // (done)
        }
      });
    } else { // (done)
      // Generate all possible moves for existing pawns (done)
      board.forEach((cell, index) => { // (done)
        if (cell === 'uwong') { // (done)
          connections[index].forEach(neighbor => { // (done)
            if (board[neighbor] === null) { // (done)
              moves.push({ from: index, to: neighbor }); // (done)
            }
          });
        }
      });
    }

    return moves; // (done)
  };

  // Updated minimax function and related helpers in MacananGameContext.js (done)

  const minimax = (depth, maximizingPlayer, nextBoard, nextUwongPawnsInHand, nextGameState, nextUwongTotal, alpha = -Infinity, beta = Infinity) => { // (done)
    const macanPosNow = nextBoard.findIndex(pos => pos === "macan"); // (done)
    let gameOver = false; // (done)
    let winner = null; // (done)

    // Check win conditions (done)
    if (nextUwongTotal < 14) { // (done)
      gameOver = true; // (done)
      winner = 'macan'; // (done)
    }

    const macanCanMove = canMacanMoveCounter(macanPosNow, nextBoard); // (done)
    if (macanCanMove === 0) { // (done)
      gameOver = true; // (done)
      winner = 'uwong'; // (done)
    }

    if (depth === 0 || gameOver) { // (done)
      let score = 0; // (done)

      // Base scoring (done)
      score -= nextUwongTotal * 10;  // Prioritize reducing Uwong pawns (done)
      score += macanCanMove * 4;     // Encourage keeping movement options (done)

      // Win/loss conditions (done)
      if (winner === 'macan') score = 10000 - depth; // Prefer faster wins (done)
      if (winner === 'uwong') score = -10000 + depth; // Prefer slower losses (done)

      return { score }; // (done)
    }

    if (maximizingPlayer) { // (done)
      let maxEval = { score: -Infinity }; // (done)
      const moves = generateMacanMoves(macanPosNow, nextBoard); // (done)

      for (const move of moves) { // (done)
        const newBoard = [...nextBoard]; // (done)
        let newUwongTotal = nextUwongTotal; // (done)

        // Apply move (done)
        newBoard[macanPosNow] = null; // (done)
        newBoard[move.position] = 'macan'; // (done)

        // Handle jumps and captures (done)
        if (move.isJump) { // (done)
          move.captured.forEach(pos => { // (done)
            newBoard[pos] = null; // (done)
            newUwongTotal--; // (done)
          });
        }

        const evaluation = minimax( // (done)
          depth - 1, // (done)
          false, // (done)
          newBoard, // (done)
          nextUwongPawnsInHand, // (done)
          'moving', // (done)
          newUwongTotal, // (done)
          alpha, // (done)
          beta // (done)
        );

        if (evaluation.score > maxEval.score) { // (done)
          maxEval = { score: evaluation.score, move }; // (done)
        }

        alpha = Math.max(alpha, evaluation.score); // (done)
        if (beta <= alpha) break; // Alpha-beta pruning (done)
      }

      return maxEval; // (done)
    } else { // (done)
      let minEval = { score: Infinity }; // (done)
      const moves = generateUwongMoves(nextBoard, nextUwongPawnsInHand, nextGameState); // (done)

      for (const move of moves) { // (done)
        const newBoard = [...nextBoard]; // (done)
        let newUwongPawns = nextUwongPawnsInHand; // (done)
        let newGameState = nextGameState; // (done)

        // Apply Uwong move (done)
        if (nextGameState === 'placing') { // (done)
          newBoard[move.position] = 'uwong'; // (done)
          newUwongPawns--; // (done)
          if (newUwongPawns === 0) newGameState = 'moving'; // (done)
        } else { // (done)
          newBoard[move.from] = null; // (done)
          newBoard[move.to] = 'uwong'; // (done)
        }

        const evaluation = minimax( // (done)
          depth - 1, // (done)
          true, // (done)
          newBoard, // (done)
          newUwongPawns, // (done)
          newGameState, // (done)
          nextUwongTotal, // (done)
          alpha, // (done)
          beta // (done)
        );

        if (evaluation.score < minEval.score) { // (done)
          minEval = { score: evaluation.score, move }; // (done)
        }

        beta = Math.min(beta, evaluation.score); // (done)
        if (beta <= alpha) break; // Alpha-beta pruning (done)
      }

      return minEval; // (done)
    }
  };


  // Updated AI click handler (done)
  const handleAIClick = () => { // (done)
    if (currentPlayer === 'macan' && !win) { // (done)
      const depth = 3; // Adjust depth based on difficulty (done)
      const result = minimax( // (done)
        depth, // (done)
        true, // (done)
        board, // (done)
        uwongPawnsInHand, // (done)
        gameState, // (done)
        uwongTotal // (done)
      );

      if (result.move) { // (done)
        if (gameState === 'moving') { // (done)
          // Handle movement (done)
          const newBoard = [...board]; // (done)
          newBoard[macanPos] = null; // (done)
          newBoard[result.move.position] = 'macan'; // (done)

          if (result.move.isJump) { // (done)
            result.move.captured.forEach(pos => { // (done)
              newBoard[pos] = null; // (done)
              setUwongTotal(prev => prev - result.move.captured.length); // (done)
            });
          }

          setBoard(newBoard); // (done)
          setMacanPos(result.move.position); // (done)
          setCurrentPlayer('uwong'); // (done)
          setMessage('Uwong: Move existing ones'); // (done)
        } else if (gameState === 'placing') { // (done)
          // Handle initial placement (done)
          const newBoard = [...board]; // (done)
          newBoard[result.move.position] = 'macan'; // (done)
          setBoard(newBoard); // (done)
          setMacanPos(result.move.position); // (done)
          setCurrentPlayer('uwong'); // (done)
          setMessage('Uwong: Place remaining pawns'); // (done)
        }
      }
    }
  };


  // Win condition check effect
  useEffect(() => {
    // check all the move macan possible to take (not done)
    const canMacanMove = (from) => {
      const walk = connections[from];
      const jump = macanJump[from];

      // for checking the current node to neighbour node (not done)
      for (const w of walk) {
        if (board[w] !== "uwong") {
          return true;
        }
      }

      // for checking all the jump available for macan (not done)
      for (const key in jump) {
        if (Object.prototype.hasOwnProperty.call(jump, key)) {
          let value = jump[key];
          let adaMusuh = true;

          for (const wong of value) {
            if (board[wong] != "uwong") {
              adaMusuh = false;
            }
          }

          if (adaMusuh) {
            if (board[key] != "uwong") {
              return true;
            }
          }
        }
      }

      return false;
    };

    if (currentPlayer == "uwong" && uwongTotal < 14) {
      setWin(true);
      setWinner("macan");
      setMessage("Macan Win!");
    }

    if (macanPos != null) {
      if (!canMacanMove(macanPos)) {
        setWin(true);
        setWinner("uwong");
        setMessage("Uwong Win!");
      }
    }
  }, [currentPlayer, uwongTotal]);

  // Node positions calculation effect
  useEffect(() => {
    const calculateNodePositions = () => {
      if (boardRef.current) {
        const positions = {};
        const nodes = boardRef.current.getElementsByTagName('button');

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

  const contextValue = {
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
    handleAIClick,
    firstMove,
    renderConnections: () => {
      const lines = [];

      Object.entries(connections).forEach(([from, tos]) => {
        tos.forEach((to) => {
          // Only render if both positions exist and are different (not done)
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
    }
  };

  return (
    <MacananGameContext.Provider value={contextValue}>
      {children}
    </MacananGameContext.Provider>
  );
};

export const useMacananGame = () => {
  const context = useContext(MacananGameContext);
  if (!context) {
    throw new Error('useMacananGame must be used within a MacananGameProvider');
  }
  return context;
};
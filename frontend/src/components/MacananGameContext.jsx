// MacananGameContext.jsx
import {createContext, useContext, useState, useEffect, useRef} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import { CONNECTIONS, MACAN_JUMP } from './ContextComponents/constants';


const MacananGameContext = createContext();

export const MacananGameProvider = ({children}) => {
  const navigate = useNavigate();
  const [board, setBoard] = useState(Array(37).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('uwong');
  const [uwongPawnsInHand, setUwongPawnsInHand] = useState(21);
  const [gameState, setGameState] = useState('initial');
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [message, setMessage] = useState('Uwong: Click anywhere to place initial 3x3 formation');
  const [win, setWin] = useState(false);
  const [winner, setWinner] = useState(null);
  const [uwongTotal, setUwongTotal] = useState(21);
  const [macanPos, setMacanPos] = useState(null);
  const [nodePositions, setNodePositions] = useState({});
  const boardRef = useRef(null);
  const [firstMove, setFirstMove] = useState({uwong: true, macan: false});
  const location = useLocation(); 

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
      setUwongPawnsInHand((prev) => prev - 1);
    });

    setBoard(newBoard);
    setCurrentPlayer('macan');
    setGameState('placing');
    setMessage('Macan: Place your piece');
    setFirstMove({...firstMove, uwong: false});
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

  const canMacanMoveCounter = (from, board) => {
    let ctr = 0;
    const walk = CONNECTIONS[from];
    if (!walk) return 0; // Add check if walk is undefined

    // Count walk moves
    walk.forEach(neighbor => {
      if (board[neighbor] === null) ctr++;
    });

    // Count jump moves
    const jumpPaths = MACAN_JUMP[from];
    if (jumpPaths) { // Add check if jumpPaths is undefined
      for (const targetPos in jumpPaths) {
        const path = jumpPaths[targetPos];
        const allUwong = path.every(pos => board[pos] === 'uwong');
        if (board[targetPos] === null && allUwong) ctr++;
      }
    }

    return ctr;
  };


  const canMacanWalkCounter = (from) => {
    let ctr = 0;
    const walk = connections[from];
    if (!walk) return 0; // Add check if walk is undefined

    // for checking the current node to neighbour node
    for (const w of walk) {
      if (board[w] !== "uwong") {
        ctr += 1;
      }
    }

    return ctr;
  }

  const canMacanJumpCounter = (from) => {
    let ctr = 0;
    const jump = macanJump[from];
    if (!jump) return 0; // Add check if jump is undefined

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
            setFirstMove({...firstMove, macan: false});
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

  const generatePlacingMacanMoves = (board) => {
    const moves = [];

    board.forEach((value, index) => {
      if (board[index] === null) {
        moves.push({
          position: index,
          captured: [],
          isJump: false
        });
      }
    });

    return moves
  }

  // Helper functions for move generation
  const generateMacanMoves = (currentPos, board) => {
    const moves = [];

    // Generate normal moves
    if (CONNECTIONS[currentPos]) { // Check if connections[currentPos] is defined
      CONNECTIONS[currentPos].forEach(neighbor => {
        if (board[neighbor] === null) {
          moves.push({
            position: neighbor,
            captured: [],
            isJump: false
          });
        }
      });
    }


    // Generate jump moves
    const jumpPaths = MACAN_JUMP[currentPos];
    if (jumpPaths) { // Check if jumpPaths is defined
      for (const targetPos in jumpPaths) {
        const path = jumpPaths[targetPos];
        const allUwong = path.every(pos => board[pos] === 'uwong');
        if (board[targetPos] === null && allUwong) {
          moves.push({
            position: parseInt(targetPos),
            captured: path,
            isJump: true
          });
        }
      }
    }


    return moves;
  };

  const generateUwongMoves = (board, uwongPawnsInHand, gameState) => {
    const moves = [];

    if (gameState === 'placing') {
      // Generate all empty positions for placing pawns
      board.forEach((cell, index) => {
        if (cell === null) {
          moves.push({position: index});
        }
      });
    } else if (gameState === 'moving') {
      // Generate all possible moves for existing pawns
      board.forEach((cell, index) => {
        if (cell === 'uwong') {
          if (connections[index]) { // Check if connections[index] is defined
            connections[index].forEach(neighbor => {
              if (board[neighbor] === null) {
                moves.push({from: index, to: neighbor});
              }
            });
          }
        }
      });
    } else if (gameState === "initial") {
      const idxtaruh = [6, 7, 8, 11, 12, 13, 16, 17, 18]
      idxtaruh.forEach((value) => {
        moves.push({position: value})
      });
    }

    return moves;
  };

  // Updated minimaxForMacan function and related helpers in MacananGameContext.js

  const minimaxForMacan = (depth, maximizingPlayer, nextBoard, nextUwongPawnsInHand, nextGameState, nextUwongTotal, alpha = -Infinity, beta = Infinity) => {
    const macanPosNow = nextBoard.findIndex(pos => pos === "macan");
    let gameOver = false;
    let winner = null;

    if (nextUwongTotal < 14) {
      gameOver = true;
      winner = 'macan';
    }

    let macanCanMove = 0;

    if (macanPosNow != -1) {
      macanCanMove = canMacanMoveCounter(macanPosNow, nextBoard);
      if (macanCanMove === 0) {
        gameOver = true;
        winner = 'uwong';
      }
    } else {
      macanCanMove = 37 - 9
    }

    if (depth === 0 || gameOver) {
      let score = 0;

      // Base scoring
      score -= nextUwongTotal * 10;  // Prioritize reducing Uwong pawns
      score += macanCanMove * 4;     // Encourage keeping movement options

      // Win/loss conditions
      if (winner === 'macan') score = 10000 - depth; // Prefer faster wins
      if (winner === 'uwong') score = -10000 + depth; // Prefer slower losses

      return {score};
    }

    if (maximizingPlayer) {
      let maxEval = {score: -Infinity};
      let moves = null

      if (macanPosNow == -1) {
        moves = generatePlacingMacanMoves(nextBoard)
      } else {
        moves = generateMacanMoves(macanPosNow, nextBoard);
      }

      for (const move of moves) {
        const newBoard = [...nextBoard];
        let newUwongTotal = nextUwongTotal;

        // Apply move
        newBoard[macanPosNow] = null;
        newBoard[move.position] = 'macan';

        // Handle jumps and captures
        if (move.isJump) {
          move.captured.forEach(pos => {
            newBoard[pos] = null;
            newUwongTotal--;
          });
        }

        let uwongGameState = "";

        if (nextUwongPawnsInHand == 0) {
          uwongGameState = 'moving'
        } else {
          uwongGameState = 'placing'
        }

//        console.log("maximizing");
//        console.log(depth - 1, false, newBoard, nextUwongPawnsInHand, uwongGameState, newUwongTotal, alpha, beta);

        const evaluation = minimaxForMacan(
          depth - 1,
          false,
          newBoard,
          nextUwongPawnsInHand,
          uwongGameState,
          newUwongTotal,
          alpha,
          beta
        );

        if (evaluation.score > maxEval.score) {
          maxEval = {score: evaluation.score, move};
        }

        alpha = Math.max(alpha, evaluation.score);
        if (beta <= alpha) break; // Alpha-beta pruning
      }

      return maxEval;
    } else {
      let minEval = {score: Infinity};
      const moves = generateUwongMoves(nextBoard, nextUwongPawnsInHand, nextGameState);

//      console.log(moves);

      for (const move of moves) {
        const newBoard = [...nextBoard];
        let newUwongPawns = nextUwongPawnsInHand;
        let newGameState = nextGameState;

        // Apply Uwong move
        if (nextGameState === 'placing') {
          newBoard[move.position] = 'uwong';
          newUwongPawns--;
          if (newUwongPawns === 0) newGameState = 'moving';
        } else {
          newBoard[move.from] = null;
          newBoard[move.to] = 'uwong';
        }

//        console.log("minimazing");
//        console.log(depth - 1, false, newBoard, newUwongPawns, newGameState, nextUwongTotal, alpha, beta);

        const evaluation = minimaxForMacan(
          depth - 1,
          true,
          newBoard,
          newUwongPawns,
          newGameState,
          nextUwongTotal,
          alpha,
          beta
        );

        if (evaluation.score < minEval.score) {
          minEval = {score: evaluation.score, move};
        }

        beta = Math.min(beta, evaluation.score);
        if (beta <= alpha) break; // Alpha-beta pruning
      }

      return minEval;
    }
  };

  // Updated AI click handler
  const handleAIClick = () => {
    const depth = 3; // Adjust depth based on difficulty
    console.warn('macan pos', macanPos);
    if (currentPlayer === 'macan' && !win) {
      const result = minimaxForMacan(
        depth,
        true,
        board,
        uwongPawnsInHand,
        gameState,
        uwongTotal
      );


      if (result.move) {
        if (gameState === 'moving') {
          // Handle movement
          const newBoard = [...board];
          newBoard[macanPos] = null;
          newBoard[result.move.position] = 'macan';

          if (result.move.isJump) {
            result.move.captured.forEach(pos => {
              newBoard[pos] = null;
              setUwongTotal(prev => prev - 1);
            });
          }

          setBoard(newBoard);
          setMacanPos(result.move.position);


          if (uwongPawnsInHand == 0) {
            setCurrentPlayer('uwong');
            setMessage('Uwong: Move existing ones');
            setGameState('moving')
          } else {
            setCurrentPlayer('uwong');
            setMessage('Uwong: Place remaining pawns');
            setGameState('placing')
          }

        } else if (gameState === 'placing') {
          console.log("masuk ke mode placing macan");
          // Handle initial placement
          const newBoard = [...board];
          newBoard[result.move.position] = 'macan';
          setBoard(newBoard);
          setMacanPos(result.move.position);
          setCurrentPlayer('uwong');
          setMessage('Uwong: Place remaining pawns');
        }
      }
    } else if (currentPlayer === 'uwong' && !win) {
      const result = minimaxForMacan(
        depth,
        false,
        board,
        uwongPawnsInHand,
        gameState,
        uwongTotal
      );

      console.log("uwong move");
      console.log(result);

      if (result.move) {
        console.log(gameState);
        if (gameState === 'initial') {
          // AI places initial formation in a good position (center)
          const validCenter = [6, 7, 8, 11, 12, 13, 16, 17, 18];
          const centerPosition = validCenter[Math.floor(Math.random() * validCenter.length)];
          place3x3Formation(centerPosition); // Center position
          setUwongPawnsInHand(uwongPawnsInHand - 9);
          console.log('pawns in hand', uwongPawnsInHand);
        } else if (gameState === 'moving') {
          // Handle movement
          const newBoard = [...board];
          newBoard[result.move.from] = null;
          newBoard[result.move.to] = 'uwong'

          setBoard(newBoard);
          setCurrentPlayer('macan');
          setGameState('moving');
          setMessage('Macan: Move or eat Uwong piece(s)');

        } else if (gameState === 'placing') {
          // Handle initial placement
          const newBoard = [...board];
          newBoard[result.move.position] = 'uwong';
          setBoard(newBoard);
          setUwongPawnsInHand(prev => prev - 1);
          setCurrentPlayer('macan');
          setGameState('moving');
          setMessage('Macan: Move or eat Uwong piece(s)');
        }
      }

    }


    console.log('board', board);
  };


  // Win condition check effect
  useEffect(() => {
    // check all the move macan possible to take
    const canMacanMove = (from) => {
      const walk = CONNECTIONS[from];
      const jump = MACAN_JUMP[from];

      if (walk) {
        // for checking the current node to neighbour node
        for (const w of walk) {
          if (board[w] !== "uwong") {
            return true;
          }
        }
      }


      if (jump) {
        // for checking all the jump available for macan
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
  }, [currentPlayer, uwongTotal, macanPos, CONNECTIONS, MACAN_JUMP, board]);

  // Node positions calculation effect
  useEffect(() => {
    const calculateNodePositions = () => {
      if (boardRef.current) { // Check if boardRef.current exists
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
  }, [board, boardRef]); // Add boardRef to dependency array

  const goBack = () => {
    // Add navigation logic here if using React Router
    // For now, just reset to initial state
    setBoard(Array(37).fill(null));
    setCurrentPlayer('uwong');
    setUwongPawnsInHand(21);
    setGameState('initial');
    setSelectedPiece(null);
    setMessage('Uwong: Click anywhere to place initial 3x3 formation');
    setWin(false);
    setWinner(null);
    setUwongTotal(21);
    setMacanPos(null);
    setFirstMove({uwong: true, macan: false});
    navigate(-1);
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
    setMacanPos(null);
    setFirstMove({uwong: true, macan: false});
  };


  const renderConnections = () => {
    const lines = [];

    Object.entries(CONNECTIONS).forEach(([from, tos]) => {
      if (tos) { // Check if tos is defined
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
      }
    });

    return lines;
  };

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
    CONNECTIONS,
    MACAN_JUMP,
    handleClick,
    handleAIClick,
    firstMove,
    setCurrentPlayer,
    renderConnections,
    restartGame,
    goBack
  };

  useEffect(() => {
    restartGame();
  }, [location]);


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

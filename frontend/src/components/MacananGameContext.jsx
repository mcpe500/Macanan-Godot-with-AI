// MacananGameContext.jsx
import {createContext, useContext, useState, useEffect, useRef} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';


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

  const connections = {
    0: new Uint8Array([1, 5, 6]),
    1: new Uint8Array([0, 2, 6]),
    2: new Uint8Array([1, 3, 6, 7, 8]),
    3: new Uint8Array([2, 4, 8]),
    4: new Uint8Array([3, 8, 9]),
    5: new Uint8Array([0, 6, 10]),
    6: new Uint8Array([0, 1, 2, 5, 7, 10, 11, 12]),
    7: new Uint8Array([2, 6, 8, 12]),
    8: new Uint8Array([2, 3, 4, 7, 9, 12, 13, 14]),
    9: new Uint8Array([4, 8, 14]),
    10: new Uint8Array([5, 6, 11, 15, 16, 26, 28, 30]),
    11: new Uint8Array([6, 10, 12, 16]),
    12: new Uint8Array([6, 7, 8, 11, 13, 16, 17, 18]),
    13: new Uint8Array([8, 12, 14, 18]),
    14: new Uint8Array([8, 9, 13, 18, 19, 31, 33, 35]),
    15: new Uint8Array([10, 16, 20]),
    16: new Uint8Array([10, 11, 12, 15, 17, 20, 21, 22]),
    17: new Uint8Array([12, 16, 18, 22]),
    18: new Uint8Array([12, 13, 14, 17, 19, 22, 23, 24]),
    19: new Uint8Array([14, 18, 24]),
    20: new Uint8Array([15, 16, 21]),
    21: new Uint8Array([16, 20, 22]),
    22: new Uint8Array([16, 17, 18, 21, 23]),
    23: new Uint8Array([18, 22, 24]),
    24: new Uint8Array([18, 19, 23]),
    25: new Uint8Array([26, 27]),
    26: new Uint8Array([25, 28, 10]),
    27: new Uint8Array([25, 28, 29]),
    28: new Uint8Array([26, 27, 10, 30]),
    29: new Uint8Array([27, 30]),
    30: new Uint8Array([28, 29, 10]),
    31: new Uint8Array([14, 32, 33]),
    32: new Uint8Array([31, 34]),
    33: new Uint8Array([14, 31, 34, 35]),
    34: new Uint8Array([32, 33, 36]),
    35: new Uint8Array([14, 33, 36]),
    36: new Uint8Array([34, 35])
  };

  const macanJump = {
    0: {
      2: new Uint8Array([1]),
      4: new Uint8Array([1, 2, 3]),
      12: new Uint8Array([6]),
      24: new Uint8Array([6, 12, 18]),
      10: new Uint8Array([5]),
      20: new Uint8Array([5, 10, 15])
    },
    1: {
      3: new Uint8Array([2]),
      11: new Uint8Array([6]),
      21: new Uint8Array([6, 11, 16])
    },
    2: {
      4: new Uint8Array([3]),
      14: new Uint8Array([8]),
      36: new Uint8Array([8, 14, 35]),
      12: new Uint8Array([7]),
      22: new Uint8Array([7, 12, 17]),
      10: new Uint8Array([6]),
      29: new Uint8Array([6, 10, 30]),
      0: new Uint8Array([1])
    },
    3: {
      13: new Uint8Array([8]),
      23: new Uint8Array([8, 13, 18]),
      1: new Uint8Array([2])
    },
    4: {
      14: new Uint8Array([9]),
      24: new Uint8Array([9, 14, 19]),
      12: new Uint8Array([8]),
      20: new Uint8Array([8, 12, 16]),
      2: new Uint8Array([3]),
      0: new Uint8Array([3, 2, 1])
    },
    5: {
      7: new Uint8Array([6]),
      9: new Uint8Array([6, 7, 8]),
      15: new Uint8Array([10])
    },
    6: {
      8: new Uint8Array([7]),
      18: new Uint8Array([12]),
      16: new Uint8Array([11]),
      30: new Uint8Array([10])
    },
    7: {
      9: new Uint8Array([8]),
      17: new Uint8Array([12]),
      5: new Uint8Array([6])
    },
    8: {
      35: new Uint8Array([14]),
      18: new Uint8Array([13]),
      16: new Uint8Array([12]),
      6: new Uint8Array([7])
    },
    9: {
      19: new Uint8Array([14]),
      7: new Uint8Array([8]),
      5: new Uint8Array([8, 7, 6])
    },
    10: {
      12: new Uint8Array([11]),
      14: new Uint8Array([11, 12, 13]),
      34: new Uint8Array([11, 12, 13, 14, 33]),
      22: new Uint8Array([16]),
      20: new Uint8Array([15]),
      29: new Uint8Array([30]),
      27: new Uint8Array([28]),
      25: new Uint8Array([26]),
      0: new Uint8Array([5]),
      2: new Uint8Array([6])
    },
    11: {
      13: new Uint8Array([12]),
      33: new Uint8Array([12, 13, 14]),
      21: new Uint8Array([16]),
      28: new Uint8Array([10]),
      1: new Uint8Array([6])
    },
    12: {
      14: new Uint8Array([13]),
      34: new Uint8Array([13, 14, 33]),
      24: new Uint8Array([18]),
      22: new Uint8Array([17]),
      20: new Uint8Array([16]),
      10: new Uint8Array([11]),
      27: new Uint8Array([11, 10, 28]),
      0: new Uint8Array([6]),
      2: new Uint8Array([7]),
      4: new Uint8Array([8])
    },
    13: {
      33: new Uint8Array([14]),
      23: new Uint8Array([18]),
      11: new Uint8Array([12]),
      28: new Uint8Array([12, 11, 10]),
      3: new Uint8Array([8])
    },
    14: {
      34: new Uint8Array([33]),
      36: new Uint8Array([35]),
      24: new Uint8Array([19]),
      22: new Uint8Array([18]),
      12: new Uint8Array([13]),
      10: new Uint8Array([13, 12, 11]),
      27: new Uint8Array([13, 12, 11, 10, 28]),
      2: new Uint8Array([8]),
      4: new Uint8Array([9]),
      32: new Uint8Array([31])
    },
    15: {
      17: new Uint8Array([16]),
      19: new Uint8Array([16, 17, 18]),
      5: new Uint8Array([10])
    },
    16: {
      18: new Uint8Array([17]),
      26: new Uint8Array([10]),
      6: new Uint8Array([11]),
      8: new Uint8Array([12])
    },
    17: {
      19: new Uint8Array([18]),
      15: new Uint8Array([16]),
      7: new Uint8Array([12])
    },
    18: {
      16: new Uint8Array([17]),
      6: new Uint8Array([12]),
      8: new Uint8Array([13]),
      31: new Uint8Array([14])
    },
    19: {
      17: new Uint8Array([18]),
      15: new Uint8Array([18, 17, 16]),
      9: new Uint8Array([14])
    },
    20: {
      22: new Uint8Array([21]),
      24: new Uint8Array([21, 22, 23]),
      10: new Uint8Array([15]),
      0: new Uint8Array([15, 10, 5]),
      12: new Uint8Array([16]),
      4: new Uint8Array([16, 12, 8])
    },
    21: {
      23: new Uint8Array([22]),
      11: new Uint8Array([16]),
      1: new Uint8Array([16, 11, 6])
    },
    22: {
      24: new Uint8Array([23]),
      20: new Uint8Array([21]),
      10: new Uint8Array([16]),
      25: new Uint8Array([16, 10, 26]),
      12: new Uint8Array([17]),
      2: new Uint8Array([17, 12, 7]),
      14: new Uint8Array([18]),
      32: new Uint8Array([18, 14, 31])
    },
    23: {
      21: new Uint8Array([22]),
      13: new Uint8Array([18]),
      3: new Uint8Array([18, 13, 8])
    },
    24: {
      22: new Uint8Array([23]),
      20: new Uint8Array([23, 22, 21]),
      12: new Uint8Array([18]),
      0: new Uint8Array([18, 12, 6]),
      14: new Uint8Array([19]),
      4: new Uint8Array([19, 14, 9])
    },
    25: {
      10: new Uint8Array([26]),
      22: new Uint8Array([26, 10, 16]),
      29: new Uint8Array([27])
    },
    26: {
      16: new Uint8Array([10]),
      30: new Uint8Array([28])
    },
    27: {
      10: new Uint8Array([28]),
      12: new Uint8Array([28, 10, 11]),
      14: new Uint8Array([28, 10, 11, 12, 13]),
      34: new Uint8Array([28, 10, 11, 12, 13, 14, 33])
    },
    28: {
      11: new Uint8Array([10]),
      13: new Uint8Array([10, 11, 12]),
      33: new Uint8Array([10, 11, 12, 13, 14])
    },
    29: {
      25: new Uint8Array([27]),
      10: new Uint8Array([30]),
      2: new Uint8Array([30, 10, 6])
    },
    30: {
      26: new Uint8Array([28]),
      6: new Uint8Array([10])
    },
    31: {
      35: new Uint8Array([33]),
      18: new Uint8Array([14])
    },
    32: {
      36: new Uint8Array([34]),
      14: new Uint8Array([31]),
      22: new Uint8Array([31, 14, 18])
    },
    33: {
      13: new Uint8Array([14]),
      11: new Uint8Array([14, 13, 12]),
      28: new Uint8Array([14, 13, 12, 11, 10])
    },
    34: {
      14: new Uint8Array([33]),
      12: new Uint8Array([33, 14, 13]),
      10: new Uint8Array([33, 14, 13, 12, 11]),
      27: new Uint8Array([33, 14, 13, 12, 11, 10, 28])
    },
    35: {
      8: new Uint8Array([14]),
      31: new Uint8Array([33])
    },
    36: {
      14: new Uint8Array([35]),
      2: new Uint8Array([35, 14, 8]),
      32: new Uint8Array([34])
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
    const walk = connections[from];
    if (!walk) return 0; // Add check if walk is undefined

    // Count walk moves
    walk.forEach(neighbor => {
      if (board[neighbor] === null) ctr++;
    });

    // Count jump moves
    const jumpPaths = macanJump[from];
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
    if (connections[currentPos]) { // Check if connections[currentPos] is defined
      connections[currentPos].forEach(neighbor => {
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
    const jumpPaths = macanJump[currentPos];
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
      const walk = connections[from];
      const jump = macanJump[from];

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
  }, [currentPlayer, uwongTotal, macanPos, connections, macanJump, board]);

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

    Object.entries(connections).forEach(([from, tos]) => {
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
    connections,
    macanJump,
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

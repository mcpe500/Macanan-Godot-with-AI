// MacananGameContext.js
import { createContext, useContext, useState, useEffect, useRef } from 'react';

const MacananGameContext = createContext();

export const MacananGameProvider = ({ children }) => {
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
      10: [13, 12 , 11],
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
    if(path == null) return false;

    let eat = true;
    for (const p of path) {
      if (board[p] !== "uwong"){
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

  const handleClick = (position) => {
    if(!win){
      if (gameState === 'initial') {
        place3x3Formation(position);
      } else if (gameState === 'placing') {
        if (currentPlayer === 'macan') {
          if(board[position] === null){
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
          } else {
            setMessage("Macan: Choose an empty place");
          }
        } else if (currentPlayer === 'uwong') {
          if(board[position] === null){
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
        if(board[position] !== null){
          if(board[position] === currentPlayer){
            setSelectedPiece(position);
            setMessage(`${currentPlayer}: Selected piece at position ${position}`);
          }
        } else {
          if(selectedPiece !== null){
            if(currentPlayer === 'macan'){
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

  // Win condition check effect
  useEffect(() => {
    const canMacanMove = (from) => {
      const walk = connections[from];
      const jump = macanJump[from];
      
      for (const w of walk) {
        if(board[w] !== "uwong"){
          return true;
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
    };

    if(currentPlayer == "uwong" && uwongTotal < 14){
      setWin(true);
      setWinner("macan");
      setMessage("Macan Win!");
    }

    if(macanPos != null){
      if(!canMacanMove(macanPos)){
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
    renderConnections: () => {
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

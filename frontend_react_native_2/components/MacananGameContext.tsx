// MacananGameContext.tsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Svg, Line } from 'react-native-svg';
import { LayoutChangeEvent, View } from 'react-native';

// Define types for the game state and context value
type Player = 'uwong' | 'macan';
type GameState = 'initial' | 'macanPlacement' | 'uwongMove' | 'macanMove' | 'gameOver';
type BoardPiece = Player | null;
type Board = BoardPiece[];
type NodePositions = Record<number, { x: number; y: number }>;
type Connections = Record<number, number[]>;

interface MacananGameContextValue {
  board: Board;
  currentPlayer: Player;
  uwongPawnsInHand: number;
  gameState: GameState;
  selectedPiece: number | null;
  message: string;
  win: boolean;
  winner: Player | null;
  uwongTotal: number;
  macanPos: number | null;
  nodePositions: NodePositions;
  boardRef: React.RefObject<View>;
  firstMove: { uwong: boolean; macan: boolean };
  connections: Connections;
  setBoard: React.Dispatch<React.SetStateAction<Board>>;
  setCurrentPlayer: React.Dispatch<React.SetStateAction<Player>>;
  setUwongPawnsInHand: React.Dispatch<React.SetStateAction<number>>;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  setSelectedPiece: React.Dispatch<React.SetStateAction<number | null>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setWin: React.Dispatch<React.SetStateAction<boolean>>;
  setWinner: React.Dispatch<React.SetStateAction<Player | null>>;
  setUwongTotal: React.Dispatch<React.SetStateAction<number>>;
  setMacanPos: React.Dispatch<React.SetStateAction<number | null>>;
  setNodePositions: React.Dispatch<React.SetStateAction<NodePositions>>;
  setFirstMove: React.Dispatch<React.SetStateAction<{ uwong: boolean; macan: boolean }>>;
  handleInitialPlacement: (index: number) => void;
  handleMacanPlacement: (index: number) => void;
  handlePawnMove: (index: number) => void;
  resetGame: () => void;
  isValidMove: (from: number, to: number, pieceType: Player) => boolean;
  isCaptureMove: (from: number, to: number, currentBoard: Board, pieceType: Player) => boolean;
  calculateCapturePositions: (macanPosition: number, currentBoard: Board) => number[];
  findJumpTarget: (macanPosition: number, overPawnPosition: number, currentBoard: Board) => number | null;
  isValidMacanMove: (from: number, to: number, currentBoard: Board) => boolean;
  renderLines: () => JSX.Element[];
  handleNodeLayout: (event: LayoutChangeEvent, index: number) => void;
}

const MacananGameContext = createContext<MacananGameContextValue>({} as MacananGameContextValue);

interface MacananGameProviderProps {
  children: React.ReactNode;
}

export const MacananGameProvider: React.FC<MacananGameProviderProps> = ({ children }) => {
  const [board, setBoard] = useState<Board>(Array(37).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('uwong');
  const [uwongPawnsInHand, setUwongPawnsInHand] = useState<number>(21);
  const [gameState, setGameState] = useState<GameState>('initial');
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('Uwong: Click anywhere to place initial 3x3 formation');
  const [win, setWin] = useState<boolean>(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [uwongTotal, setUwongTotal] = useState<number>(21);
  const [macanPos, setMacanPos] = useState<number | null>(null);
  const [nodePositions, setNodePositions] = useState<NodePositions>({});
  const boardRef = useRef<View>(null);
  const [firstMove, setFirstMove] = useState<{ uwong: boolean; macan: boolean }>({ 
    uwong: true, 
    macan: false 
  });

  // Define connections with explicit type
  const connections: Connections = {
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

  // Define macanJump with proper typing
  const macanJump: Record<number, Record<number, number[]>> = {
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

  const handleNodeLayout = (event: LayoutChangeEvent, index: number) => {
    const { layout } = event.nativeEvent;
    setNodePositions(prevPositions => ({
      ...prevPositions,
      [index]: {
        x: layout.x + layout.width / 2,
        y: layout.y + layout.height / 2,
      }
    }));
  };

  // Fixed findJumpTarget with proper typing
  const findJumpTarget = (
    macanPosition: number,
    overPawnPosition: number,
    currentBoard: Board
  ): number | null => {
    const sharedConnections = connections[macanPosition]?.filter(node => 
      connections[overPawnPosition]?.includes(node)
    ) || [];

    for (const target of sharedConnections) {
      if (target !== macanPosition && 
          target !== overPawnPosition && 
          currentBoard[target] === null) {
        return target;
      }
    }
    return null;
  };

  // Fixed isValidMacanMove with proper typing
  const isValidMacanMove = (from: number, to: number, currentBoard: Board): boolean => {
    if (!connections[from]?.includes(to)) {
      return false;
    }

    if (currentBoard[to] === 'uwong') {
      const jumpTarget = findJumpTarget(from, to, currentBoard);
      return jumpTarget !== null;
    }

    return currentBoard[to] === null;
  };

  // Fixed renderLines with proper numeric type handling
  const renderLines = (): JSX.Element[] => {
    const lines: JSX.Element[] = [];

    Object.entries(connections).forEach(([fromStr, tos]) => {
      const from = parseInt(fromStr, 10);
      tos.forEach(to => {
        const startNode = nodePositions[from];
        const endNode = nodePositions[to];
        
        if (startNode && endNode && from !== to) {
          lines.push(
            <Line
              key={`${from}-${to}`}
              x1={startNode.x}
              y1={startNode.y}
              x2={endNode.x}
              y2={endNode.y}
              stroke="#CBD5E0"
              strokeWidth="2"
            />
          );
        }
      });
    });

    return lines;
  };

  const resetGame = (): void => {
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
    setFirstMove({ uwong: true, macan: false });
  };


  const handleInitialPlacement = (index: number): void => {
    if (gameState === 'initial' && currentPlayer === 'uwong' && uwongPawnsInHand > 0 && board[index] === null) {
      const updatedBoard = [...board];
      updatedBoard[index] = 'uwong';
      setBoard(updatedBoard);
      setUwongPawnsInHand(uwongPawnsInHand - 1);

      if (uwongPawnsInHand === 18) {
        setGameState('macanPlacement');
        setMessage('Macan: Place your piece');
        setCurrentPlayer('macan');
      }
    }
  };


  const handleMacanPlacement = (index: number): void => {
    if (gameState === 'macanPlacement' && currentPlayer === 'macan' && macanPos === null && board[index] === null) {
      const updatedBoard = [...board];
      updatedBoard[index] = 'macan';
      setBoard(updatedBoard);
      setMacanPos(index);
      setGameState('uwongMove');
      setCurrentPlayer('uwong');
      setMessage('Uwong: Make your move');
    }
  };


  const handlePawnMove = (index: number): void => {
    if (gameState === 'uwongMove' && currentPlayer === 'uwong') {
      if (selectedPiece === null) {
        if (board[index] === 'uwong') {
          setSelectedPiece(index);
          setMessage('Uwong: Select where to move');
        }
      } else {
        if (index === selectedPiece) {
          setSelectedPiece(null);
          setMessage('Uwong: Make your move'); // Revert message to move instruction
        }
        else if (board[index] === null && isValidMove(selectedPiece, index, 'uwong')) {
          const updatedBoard = [...board];
          updatedBoard[selectedPiece] = null;
          updatedBoard[index] = 'uwong';
          setBoard(updatedBoard);
          setSelectedPiece(null);
          setCurrentPlayer('macan');
          setGameState('macanMove');
          setMessage('Macan: Make your move');
          setFirstMove(prevState => ({ ...prevState, macan: true }));
        } else {
          setMessage('Invalid move. Try again.');
          setSelectedPiece(null); // Clear selection on invalid move
        }
      }
    }
    if (gameState === 'macanMove' && currentPlayer === 'macan') {
      if (selectedPiece === null) {
        if (board[index] === 'macan') {
          setSelectedPiece(index);
          setMessage('Macan: Select where to move');
        }
      } else {
        if (index === selectedPiece) {
          setSelectedPiece(null);
          setMessage('Macan: Make your move'); // Revert message to move instruction
        }
        else if (board[index] === null && isValidMove(selectedPiece, index, 'macan')) {
          const updatedBoard = [...board];
          updatedBoard[selectedPiece] = null;
          updatedBoard[index] = 'macan';
          setBoard(updatedBoard);
          setMacanPos(index);
          setSelectedPiece(null);
          setCurrentPlayer('uwong');
          setGameState('uwongMove');
          setMessage('Uwong: Make your move');
          setFirstMove(prevState => ({ ...prevState, uwong: true }));
        } else {
          setMessage('Invalid move. Try again.');
          setSelectedPiece(null); // Clear selection on invalid move
        }
      }
    }
  };


  const isValidMove = (from: number, to: number, pieceType: Player): boolean => {
    if (!connections[from] || !connections[from].includes(to)) {
      return false; // Not a direct connection
    }

    if (pieceType === 'macan') {
      return isValidMacanMove(from, to, board);
    }
    return true; // Uwong moves are always valid to connected empty nodes
  };


  const isCaptureMove = (from: number, to: number, currentBoard: Board, pieceType: Player): boolean => {
    const macanPosition = pieceType === 'macan' ? from : to;
    const targetPosition = pieceType === 'macan' ? to : from;

    const possibleCapturePositions = calculateCapturePositions(macanPosition, currentBoard);
    return possibleCapturePositions.includes(targetPosition);
  };


  const calculateCapturePositions = (macanPosition: number, currentBoard: Board): number[] => {
    let capturePositions: number[] = [];
    const macanConnections = connections[macanPosition] || [];

    for (const connectedNode of macanConnections) {
      if (currentBoard[connectedNode] === 'uwong') {
        const jumpTarget = findJumpTarget(macanPosition, connectedNode, currentBoard);
        if (jumpTarget !== null) {
          capturePositions.push(jumpTarget);
        }
      }
    }
    return capturePositions;
  };


  useEffect(() => {
    const checkWinCondition = (): void => {
      let uwongCount = 0;
      let macanCount = 0;
      board.forEach(piece => {
        if (piece === 'uwong') uwongCount++;
        if (piece === 'macan') macanCount++;
      });

      if (uwongCount <= 5 && gameState !== 'initial' && gameState !== 'macanPlacement') {
        setWin(true);
        setWinner('macan');
        setGameState('gameOver');
        setMessage('Macan Wins! Uwong pawns reduced to 5 or less.');
      } else if (macanCount === 0) {
        setWin(true);
        setWinner('uwong');
        setGameState('gameOver');
        setMessage('Uwong Wins! Macan captured.');
      }
    };

    checkWinCondition();
  }, [board, gameState]);


  const contextValue: MacananGameContextValue = {
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
    firstMove,
    connections,
    setBoard,
    setCurrentPlayer,
    setUwongPawnsInHand,
    setGameState,
    setSelectedPiece,
    setMessage,
    setWin,
    setWinner,
    setUwongTotal,
    setMacanPos,
    setNodePositions,
    setFirstMove,
    handleInitialPlacement,
    handleMacanPlacement,
    handlePawnMove,
    resetGame,
    isValidMove,
    isCaptureMove,
    calculateCapturePositions,
    findJumpTarget,
    isValidMacanMove,
    renderLines,
    handleNodeLayout,
  };

  return (
    <MacananGameContext.Provider value={contextValue}>
      <Svg style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}>
        {renderLines()}
      </Svg>
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
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react';
import { View, LayoutChangeEvent, Platform, StyleSheet } from 'react-native';
import { Line, Svg } from 'react-native-svg';
import type { StackNavigationProp } from '@react-navigation/stack';
import useRegisterNavigator from './useRegisterNavigator';

// Type definitions
type Player = 'uwong' | 'macan';
type GameState = 'initial' | 'placing' | 'moving';
type Position = number | null;
type NodePositions = Record<number, { x: number; y: number }>;
type FirstMove = { uwong: boolean; macan: boolean };

interface GameContextValue {
  board: (Player | null)[];
  currentPlayer: Player;
  uwongPawnsInHand: number;
  gameState: GameState;
  selectedPiece: Position;
  message: string;
  win: boolean;
  winner: Player | null;
  uwongTotal: number;
  macanPos: Position;
  nodePositions: NodePositions;
  connections: Record<number, number[]>;
  macanJump: Record<number, Record<number, number[]>>;
  handleClick: (position: number) => void;
  handleAIClick: (movePosition: number, currentPosition?: Position) => void;
  firstMove: FirstMove;
  renderConnections: () => ReactNode;
  setSelectedPiece: React.Dispatch<React.SetStateAction<Position>>;
  boardRef: React.RefObject<View>;
  restartGame: () => void;
}

interface GameProviderProps {
  children: ReactNode;
  navigation: StackNavigationProp<any>;
}

const MacananGameContext = createContext<GameContextValue | undefined>(undefined);

export const MacananGameProvider: React.FC<GameProviderProps> = ({ children, navigation }) => {
  // State initialization
  const [board, setBoard] = useState<(Player | null)[]>(Array(37).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('uwong');
  const [uwongPawnsInHand, setUwongPawnsInHand] = useState(21);
  const [gameState, setGameState] = useState<GameState>('initial');
  const [selectedPiece, setSelectedPiece] = useState<Position>(null);
  const [message, setMessage] = useState('Uwong: Click anywhere to place initial 3x3 formation');
  const [win, setWin] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);
  const [uwongTotal, setUwongTotal] = useState(21);
  const [macanPos, setMacanPos] = useState<Position>(null);
  const [nodePositions, setNodePositions] = useState<NodePositions>({});
  const boardRef = useRef<View>(null);
  const nodeRefs = useRef<Record<number, View | null>>({});
  const [firstMove, setFirstMove] = useState<FirstMove>({ uwong: true, macan: false });

  // Static game configurations
  const connections: Record<number, number[]> = {
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

  // Game logic functions
  const place3x3Formation = useCallback((centerPosition: number) => {
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
  }, [board, firstMove, setBoard, setCurrentPlayer, setGameState, setUwongPawnsInHand, setMessage, setFirstMove]);

  const isValidMove = useCallback((from: number, to: number) => {
    return connections[from]?.includes(to);
  }, [connections]);

  const findJumpPath = useCallback((from: number, to: number) => {
    const listJump = macanJump[from];
    return listJump?.[to];
  }, [macanJump]);

  const canMacanJump = useCallback((from: number, to: number) => {
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
  }, [board, findJumpPath]);


  // Touch handling
  const handleClick = useCallback((position: number) => {
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
                  if (jumpedPos) {
                    for (const p of jumpedPos) {
                      newBoard[p] = null;
                      setUwongTotal(prev => prev - 1);
                    }
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
  }, [win, gameState, currentPlayer, selectedPiece, board, place3x3Formation, setMacanPos, setBoard, setCurrentPlayer, setGameState, setUwongPawnsInHand, setMessage, setFirstMove, isValidMove, canMacanJump, findJumpPath, setSelectedPiece, setUwongTotal]);

  const handleAIClick = useCallback((movePosition: number, currentPosition?: Position) => {
    if (!win) {
      if (gameState === 'initial') {
        place3x3Formation(movePosition);
      } else if (gameState === 'placing') {
        if (currentPlayer === 'macan') {
          if (board[movePosition] === null) {
            const newBoard = [...board];
            newBoard[movePosition] = 'macan';
            setMacanPos(movePosition);
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
          }
        } else if (currentPlayer === 'uwong') {
          if (board[movePosition] === null) {
            const newBoard = [...board];
            newBoard[movePosition] = 'uwong';
            setBoard(newBoard);
            setUwongPawnsInHand(prev => prev - 1);
            setCurrentPlayer('macan');
            setGameState('moving');
            setMessage('Macan: Move or eat Uwong piece(s)');
          }
        }
      } else if (gameState === 'moving') {
        if (currentPosition === null) {
          if (currentPlayer === 'macan') {
            if (board[movePosition] === null) {
              const newBoard = [...board];
              newBoard[movePosition] = 'macan';
              setMacanPos(movePosition);
              setBoard(newBoard);
              setCurrentPlayer('uwong');
              if (uwongPawnsInHand > 0) {
                setGameState('placing');
                setMessage('Uwong: Place remaining pawns');
              } else {
                setGameState('moving');
                setMessage('Uwong: Move existing ones');
              }
            }
          } else if (currentPlayer === 'uwong') {
            if (board[movePosition] === null) {
              const newBoard = [...board];
              newBoard[movePosition] = 'uwong';
              setBoard(newBoard);
              setCurrentPlayer('macan');
              setGameState('moving');
              setMessage('Macan: Move or eat Uwong piece(s)');
            }
          }
        } else {
          if (currentPlayer === 'macan') {
            if ((isValidMove(currentPosition ?? -1, movePosition) || canMacanJump(currentPosition ?? -1, movePosition))) {
              const newBoard = [...board];
              if (currentPosition != null) {
                newBoard[currentPosition] = null;
              }
              newBoard[movePosition] = 'macan';

              if (canMacanJump(currentPosition ?? -1, movePosition)) {
                const jumpedPos = findJumpPath(currentPosition ?? -1, movePosition);
                if (jumpedPos) {
                  for (const p of jumpedPos) {
                    newBoard[p] = null;
                    setUwongTotal(prev => prev - 1);
                  }
                }
              }

              setBoard(newBoard);
              setMacanPos(movePosition);
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
            if (isValidMove(currentPosition ?? -1, movePosition)) {
              const newBoard = [...board];
              if (currentPosition != null) {
                newBoard[currentPosition] = null;
              }
              newBoard[movePosition] = 'uwong';
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
  }, [win, gameState, currentPlayer, board, place3x3Formation, setMacanPos, setBoard, setCurrentPlayer, setGameState, setUwongPawnsInHand, setMessage, setFirstMove, isValidMove, canMacanJump, findJumpPath, setSelectedPiece, setUwongTotal]);

  // Node position calculation
  const calculateNodePositions = useCallback(() => {
    const positions: NodePositions = {};
    const measurePromises: Promise<void>[] = [];

    Object.keys(nodeRefs.current).forEach((key) => {
      const node = nodeRefs.current[Number(key)];
      if (node && node.measure) {
        const promise = new Promise<void>((resolve) => {
          node.measure((x, y, width, height, pageX, pageY) => {
            positions[Number(key)] = {
              x: pageX + width / 2,
              y: pageY + height / 2
            };
            resolve();
          });
        });
        measurePromises.push(promise);
      }
    });

    Promise.all(measurePromises).then(() => {
      setNodePositions(positions);
    });
  }, [nodeRefs, setNodePositions]);

  // Connection rendering
  const renderConnections = useCallback(() => {
    const lines: ReactNode[] = [];

    Object.entries(connections).forEach(([from, tos]) => {
      tos.forEach((to) => {
        const fromPos = nodePositions[Number(from)];
        const toPos = nodePositions[to];

        if (fromPos && toPos && Number(from) !== to) {
          lines.push(
            <Line
              key={`${from}-${to}`}
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              stroke="#CBD5E0"
              strokeWidth={2}
            />
          );
        }
      });
    });

    return <Svg style={StyleSheet.absoluteFill}>{lines}</Svg>;
  }, [nodePositions, connections]);

  // Win condition effect
  useEffect(() => {
    const canMacanMove = (from: number) => {
      const walk = connections[from];
      const jump = macanJump[from];

      for (const w of walk) {
        if (board[w] !== "uwong") {
          return true;
        }
      }

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
  }, [currentPlayer, uwongTotal, macanPos, connections, macanJump, board, setWin, setWinner, setMessage]);

  // Node position update effect
  useEffect(() => {
    calculateNodePositions();
    const resizeListener = navigation.addListener('focus', calculateNodePositions);

    return () => {
      resizeListener();
    };
  }, [navigation, calculateNodePositions, board]);

  const restartGame = useCallback(() => {
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
    setNodePositions({});
    setFirstMove({ uwong: true, macan: false });
  }, [setBoard, setCurrentPlayer, setUwongPawnsInHand, setGameState, setSelectedPiece, setMessage, setWin, setWinner, setUwongTotal, setMacanPos, setNodePositions, setFirstMove]);

  // Context value
  const contextValue: GameContextValue = {
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
    connections,
    macanJump,
    handleClick,
    handleAIClick,
    firstMove,
    renderConnections,
    setSelectedPiece,
    boardRef,
    restartGame,
  };

  return (
    <MacananGameContext.Provider value={contextValue}>
      {children}
      {renderConnections()}
    </MacananGameContext.Provider>
  );
};

export const useMacananGame = (): GameContextValue => {
  const context = useContext(MacananGameContext);
  if (!context) {
    throw new Error('useMacananGame must be used within a MacananGameProvider');
  }
  return context;
};

// StyleSheet for basic layout
const styles = StyleSheet.create({
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  node: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

// MacananGameContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native'; // For navigation
import { CONNECTIONS, MACAN_JUMP, BOARD_SIZE, INITIAL_UWONG_PAWNS, INITIAL_FORMATION_POSITIONS, WINNING_UWONG_COUNT } from './ContextComponents/constants';
import {
  isValidMove,
  canMacanJump,
  calculateFormationPositions,
  checkMacanMovement
} from './ContextComponents/logic';
import {
  generateMacanMoves,
  generateUwongMoves,
  generatePlacingMacanMoves,
  getWinner,
  evaluateGameState
} from './ContextComponents/helper';


const MacananGameContext = createContext();

export const MacananGameProvider = ({ children }) => {
  const navigation = useNavigation();
  const route = useRoute(); // To detect screen changes for restart

  const [board, setBoard] = useState(Array(BOARD_SIZE).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('uwong');
  const [uwongPawnsInHand, setUwongPawnsInHand] = useState(INITIAL_UWONG_PAWNS);
  const [gameState, setGameState] = useState('initial'); // 'initial', 'placing', 'moving'
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [message, setMessage] = useState('Uwong: Tap a center position for initial 3x3 formation');
  const [win, setWin] = useState(false);
  const [winner, setWinnerState] = useState(null); // Renamed to avoid conflict with getWinner helper
  const [uwongTotal, setUwongTotal] = useState(INITIAL_UWONG_PAWNS);
  const [macanPos, setMacanPos] = useState(null); // Store index of macan
  // nodePositions and boardRef are complex for React Native, will be handled differently for UI.
  // For now, game logic will proceed without them. UI will need a way to get layout info.
  // const [nodePositions, setNodePositions] = useState({});
  // const boardRef = useRef(null);
  const [firstMove, setFirstMove] = useState({ uwong: true, macan: true }); // Macan also has a placing move

  const place3x3Formation = (centerPosition) => {
    const newBoard = [...board];
    const positions = calculateFormationPositions(centerPosition);

    // Basic validation for center position (can be improved based on board layout)
    if (!INITIAL_FORMATION_POSITIONS.includes(centerPosition)) {
        setMessage('Invalid center. Choose one of the designated 3x3 center spots.');
        return;
    }

    let placedCount = 0;
    positions.forEach(pos => {
      if (newBoard[pos] === null) { // Ensure not overwriting anything
        newBoard[pos] = 'uwong';
        placedCount++;
      }
    });

    setBoard(newBoard);
    setUwongPawnsInHand((prev) => prev - placedCount);
    setCurrentPlayer('macan');
    setGameState('placing'); // Macan needs to place its piece
    setMessage('Macan: Place your piece');
    setFirstMove({ ...firstMove, uwong: false });
  };

  const handleClick = (position) => {
    if (win) return;

    if (gameState === 'initial' && currentPlayer === 'uwong') {
      place3x3Formation(position);
    } else if (gameState === 'placing') {
      if (currentPlayer === 'macan') {
        if (board[position] === null) {
          const newBoard = [...board];
          newBoard[position] = 'macan';
          setMacanPos(position);
          setBoard(newBoard);
          setCurrentPlayer('uwong');
          // Uwong continues placing if pawns in hand, otherwise moves to 'moving'
          if (uwongPawnsInHand > 0) {
            setGameState('placing');
            setMessage('Uwong: Place remaining pawns');
          } else {
            setGameState('moving');
            setMessage('Uwong: Move your pawns');
          }
          setFirstMove({ ...firstMove, macan: false });
        } else {
          setMessage("Macan: Choose an empty spot.");
        }
      } else if (currentPlayer === 'uwong') {
        if (uwongPawnsInHand > 0) {
          if (board[position] === null) {
            const newBoard = [...board];
            newBoard[position] = 'uwong';
            setBoard(newBoard);
            setUwongPawnsInHand(prev => prev - 1);
            // After uwong places, it's macan's turn to move (since macan is already placed)
            setCurrentPlayer('macan');
            setGameState('moving');
            setMessage('Macan: Move or capture.');
            if (uwongPawnsInHand -1 === 0) { // If that was the last pawn
                setMessage('All Uwong pawns placed. Macan: Move or capture.');
            }
          } else {
            setMessage("Uwong: Choose an empty spot to place your pawn.");
          }
        } else {
            // This case should ideally not be reached if logic is correct,
            // as uwongPawnsInHand > 0 is for placing. If 0, state should be 'moving'.
            setGameState('moving');
            setMessage('Uwong: Move your pawns.');
            // Fall through to moving logic if selectedPiece is already set
             handleMovingLogic(position);
        }
      }
    } else if (gameState === 'moving') {
        handleMovingLogic(position);
    }
  };

  const handleMovingLogic = (position) => {
    if (board[position] !== null && board[position] === currentPlayer) {
        // Select a piece
        setSelectedPiece(position);
        setMessage(`${currentPlayer.toUpperCase()}: Selected piece at ${position}. Tap destination.`);
    } else if (selectedPiece !== null && board[position] === null) { // Target position is empty
        // Attempt to move selected piece
        let moved = false;
        const newBoard = [...board];

        if (currentPlayer === 'macan') {
            const isJump = canMacanJump(selectedPiece, position, board);
            if (isValidMove(selectedPiece, position) || isJump) {
                newBoard[selectedPiece] = null;
                newBoard[position] = 'macan';
                setMacanPos(position);
                moved = true;

                if (isJump) {
                    const jumpedPath = MACAN_JUMP[selectedPiece]?.[position];
                    if (jumpedPath) {
                        let capturedCount = 0;
                        jumpedPath.forEach(p => {
                            if (newBoard[p] === 'uwong') {
                                newBoard[p] = null;
                                capturedCount++;
                            }
                        });
                        setUwongTotal(prev => prev - capturedCount);
                        setMessage(`Macan jumped and captured ${capturedCount} Uwong!`);
                    }
                } else {
                     setMessage('Macan moved.');
                }
            }
        } else if (currentPlayer === 'uwong') {
            if (isValidMove(selectedPiece, position)) {
                newBoard[selectedPiece] = null;
                newBoard[position] = 'uwong';
                moved = true;
                setMessage('Uwong moved.');
            }
        }

        if (moved) {
            setBoard(newBoard);
            setSelectedPiece(null);
            const nextPlayer = currentPlayer === 'macan' ? 'uwong' : 'macan';
            setCurrentPlayer(nextPlayer);

            if (nextPlayer === 'uwong' && uwongPawnsInHand > 0) {
                setGameState('placing');
                setMessage('Uwong: Place remaining pawns.');
            } else {
                setGameState('moving');
                setMessage(`${nextPlayer.toUpperCase()}: Your turn.`);
            }
        } else {
            setMessage(`${currentPlayer.toUpperCase()}: Invalid move from ${selectedPiece} to ${position}. Try again.`);
        }
    } else if (selectedPiece !== null && board[position] !== null && board[position] !== currentPlayer) {
        setMessage(`Cannot move to a square occupied by opponent. Select your piece or an empty square.`);
    } else {
        setMessage(`${currentPlayer.toUpperCase()}: Select your piece first or a valid empty destination.`);
    }
  };

  const minimax = (depth, maximizingPlayer, currentBoard, currentUwongPawnsInHand, currentGameState, currentUwongTotal, currentMacanPos, alpha = -Infinity, beta = Infinity) => {
    const currentWinner = getWinner(currentUwongTotal, currentMacanPos, currentBoard);
    if (depth === 0 || currentWinner) {
      return { score: evaluateGameState(currentBoard, currentUwongTotal, currentMacanPos, depth, currentWinner) };
    }

    if (maximizingPlayer) { // Macan's turn (AI)
      let maxEval = { score: -Infinity };
      let bestMove = null;
      const possibleMoves = (currentGameState === 'placing' && currentMacanPos === null) // Macan places its first piece
        ? generatePlacingMacanMoves(currentBoard)
        : generateMacanMoves(currentMacanPos, currentBoard);

      if (possibleMoves.length === 0 && currentMacanPos !== null) { // Macan is placed but has no moves
        return { score: evaluateGameState(currentBoard, currentUwongTotal, currentMacanPos, depth, 'uwong') }; // Macan loses
      }

      for (const move of possibleMoves) {
        const newBoard = [...currentBoard];
        let newUwongTotal = currentUwongTotal;
        let newMacanPos = currentMacanPos;

        if (currentGameState === 'placing' && currentMacanPos === null) {
          newBoard[move.position] = 'macan';
          newMacanPos = move.position;
        } else {
          newBoard[currentMacanPos] = null;
          newBoard[move.position] = 'macan';
          newMacanPos = move.position;
          if (move.isJump) {
            move.captured.forEach(p => {
              if (newBoard[p] === 'uwong') newBoard[p] = null;
            });
            newUwongTotal -= move.captured.length;
          }
        }

        // Next state for Uwong
        const nextUwongGameState = currentUwongPawnsInHand > 0 ? 'placing' : 'moving';
        const evaluation = minimax(depth - 1, false, newBoard, currentUwongPawnsInHand, nextUwongGameState, newUwongTotal, newMacanPos, alpha, beta);

        if (evaluation.score > maxEval.score) {
          maxEval = { score: evaluation.score };
          bestMove = move;
        }
        alpha = Math.max(alpha, evaluation.score);
        if (beta <= alpha) break;
      }
      return { ...maxEval, move: bestMove };
    } else { // Uwong's turn (opponent or another AI)
      let minEval = { score: Infinity };
      let bestMove = null;
      // Determine current game state for Uwong to generate moves
      const uwongMoveGenState = currentGameState === 'initial' ? 'initial' : (currentUwongPawnsInHand > 0 ? 'placing' : 'moving');
      const possibleMoves = generateUwongMoves(currentBoard, uwongMoveGenState, currentUwongPawnsInHand);

      if (possibleMoves.length === 0 && currentUwongPawnsInHand === 0) { // Uwong has no pawns to place and no moves
         return { score: evaluateGameState(currentBoard, currentUwongTotal, currentMacanPos, depth, 'macan') }; // Uwong loses
      }

      for (const move of possibleMoves) {
        const newBoard = [...currentBoard];
        let newUwongPawnsInHand = currentUwongPawnsInHand;
        let nextMacanGameState = 'moving'; // Macan is always moving after its first placement

        if (move.type === 'initial_formation') { // AI Uwong places 3x3
            const formationPositions = calculateFormationPositions(move.position);
            let placedCount = 0;
            formationPositions.forEach(p => { if(newBoard[p] === null) {newBoard[p] = 'uwong'; placedCount++;} });
            newUwongPawnsInHand -= placedCount;
            if (newUwongPawnsInHand === 0) nextMacanGameState = 'moving'; // Or check macan's state
        } else if (move.type === 'place') {
          newBoard[move.position] = 'uwong';
          newUwongPawnsInHand--;
          if (newUwongPawnsInHand === 0) nextMacanGameState = 'moving';
        } else if (move.type === 'move') {
          newBoard[move.from] = null;
          newBoard[move.to] = 'uwong';
        }

        const evaluation = minimax(depth - 1, true, newBoard, newUwongPawnsInHand, nextMacanGameState, currentUwongTotal, currentMacanPos, alpha, beta);
        if (evaluation.score < minEval.score) {
          minEval = { score: evaluation.score };
          bestMove = move;
        }
        beta = Math.min(beta, evaluation.score);
        if (beta <= alpha) break;
      }
      return { ...minEval, move: bestMove };
    }
  };

  const handleAIMove = () => {
    if (win) return;
    const depth = 4; // Adjust depth for difficulty

    const result = minimax(depth, currentPlayer === 'macan', board, uwongPawnsInHand, gameState, uwongTotal, macanPos);

    if (result && result.move) {
        const move = result.move;
        if (currentPlayer === 'macan') {
            const newBoard = [...board];
            let newUwongTotal = uwongTotal;
            let nextMacanPos = macanPos;

            if (gameState === 'placing' && macanPos === null) { // Macan places its piece
                newBoard[move.position] = 'macan';
                nextMacanPos = move.position;
                setMessage(`Macan AI placed at ${move.position}.`);
            } else { // Macan moves
                newBoard[macanPos] = null;
                newBoard[move.position] = 'macan';
                nextMacanPos = move.position;
                if (move.isJump) {
                    move.captured.forEach(p => { if (newBoard[p] === 'uwong') newBoard[p] = null; });
                    newUwongTotal -= move.captured.length;
                    setMessage(`Macan AI jumped from ${macanPos} to ${move.position}, capturing ${move.captured.length}.`);
                } else {
                    setMessage(`Macan AI moved from ${macanPos} to ${move.position}.`);
                }
            }
            setBoard(newBoard);
            setUwongTotal(newUwongTotal);
            setMacanPos(nextMacanPos);
            setCurrentPlayer('uwong');
            setGameState(uwongPawnsInHand > 0 ? 'placing' : 'moving');
            if (uwongPawnsInHand > 0) {
                setMessage('Uwong: Place remaining pawns.');
            } else {
                setMessage('Uwong: Your move.');
            }
            if (macanPos === null && gameState === 'placing') setFirstMove(prev => ({...prev, macan: false}));

        } else { // AI is Uwong
            const newBoard = [...board];
            let newUwongPawnsInHand = uwongPawnsInHand;

            if (move.type === 'initial_formation') {
                const formationPositions = calculateFormationPositions(move.position);
                let placedCount = 0;
                formationPositions.forEach(p => { if(newBoard[p] === null) {newBoard[p] = 'uwong'; placedCount++;} });
                newUwongPawnsInHand -= placedCount;
                setMessage(`Uwong AI placed initial formation around ${move.position}.`);
                setFirstMove(prev => ({...prev, uwong: false}));
            } else if (move.type === 'place') {
                newBoard[move.position] = 'uwong';
                newUwongPawnsInHand--;
                setMessage(`Uwong AI placed pawn at ${move.position}.`);
            } else if (move.type === 'move') {
                newBoard[move.from] = null;
                newBoard[move.to] = 'uwong';
                setMessage(`Uwong AI moved from ${move.from} to ${move.to}.`);
            }
            setBoard(newBoard);
            setUwongPawnsInHand(newUwongPawnsInHand);
            setCurrentPlayer('macan');
            // Macan state after Uwong's move: if macan not placed, it's 'placing', else 'moving'
            setGameState(macanPos === null ? 'placing' : 'moving');
             if (macanPos === null) {
                setMessage('Macan AI: Place your piece.');
            } else {
                setMessage('Macan AI: Your move.');
            }
        }
    } else {
        setMessage(`${currentPlayer.toUpperCase()} AI has no moves or error in AI logic.`);
        // Potentially a stalemate or error, might need to handle this
    }
  };


  useEffect(() => {
    const newWinner = getWinner(uwongTotal, macanPos, board);
    if (newWinner) {
      setWin(true);
      setWinnerState(newWinner);
      setMessage(`${newWinner.toUpperCase()} Wins!`);
    }
  }, [uwongTotal, macanPos, board, currentPlayer]); // Added currentPlayer to re-check on turn change

  const goBack = () => {
    restartGame(); // Reset game state
    if (navigation.canGoBack()) {
        navigation.goBack();
    } else {
        // If cannot go back (e.g. this is the first screen), navigate to a default home/menu screen
        navigation.navigate('Home'); // Assuming 'Home' is a defined route name
    }
  };

  const restartGame = () => {
    setBoard(Array(BOARD_SIZE).fill(null));
    setCurrentPlayer('uwong');
    setUwongPawnsInHand(INITIAL_UWONG_PAWNS);
    setGameState('initial');
    setSelectedPiece(null);
    setMessage('Uwong: Tap a center position for initial 3x3 formation');
    setWin(false);
    setWinnerState(null);
    setUwongTotal(INITIAL_UWONG_PAWNS);
    setMacanPos(null);
    setFirstMove({ uwong: true, macan: true });
  };

  // Restart game if the route changes (e.g., user navigates away and back)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Only restart if it's not the initial load or if game was already started
      // This logic might need refinement based on exact navigation flow
      if (gameState !== 'initial' || macanPos !== null || uwongPawnsInHand !== INITIAL_UWONG_PAWNS) {
         // console.log("Game restarting due to screen focus / route change");
         // restartGame(); // Commented out to prevent restart on every focus, which might be too aggressive.
         // Consider restarting based on specific game mode route params if needed.
      }
    });
    return unsubscribe;
  }, [navigation, gameState, macanPos, uwongPawnsInHand]);


  const contextValue = {
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
    // nodePositions, // Removed for now
    // boardRef,      // Removed for now
    CONNECTIONS,   // Still needed for UI rendering connections
    MACAN_JUMP,    // Potentially for UI hints
    handleClick,
    handleAIMove, // Changed from handleAIClick
    firstMove,
    // setCurrentPlayer, // Usually managed internally by turn changes
    // renderConnections, // This will be a UI concern, not context logic
    restartGame,
    goBack,
    // Expose individual setters if needed by UI components directly, though actions are preferred
    setBoard,
    setMessage,
    setGameState,
    setCurrentPlayer,
    setSelectedPiece
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

import React, { useEffect } from 'react';
import { useMacananGame } from './MacananGameContext';

const AIvsAI = () => {
  const {
    board,
    currentPlayer,
    uwongPawnsInHand,
    gameState,
    message,
    win,
    uwongTotal,
    macanPos,
    boardRef,
    connections,
    macanJump,
    handleClick,
    renderConnections,
    setSelectedPiece
  } = useMacananGame();

  console.log('Component rendered. Current state:', {
    board,
    currentPlayer,
    uwongPawnsInHand,
    gameState,
    message,
    win,
    uwongTotal,
    macanPos
  });

  const getAIMove = (player) => {
    console.log(`Calculating AI move for player: ${player}`);
    let bestMove = null;
    let bestScore = player === 'uwong' ? -Infinity : Infinity;

    const moves = getAvailableMoves(player);
    console.log(`Available moves for ${player}:`, moves);

    for (const move of moves) {
      const newBoard = simulateMove(board, move, player);
      const score = minimax(newBoard, 3, player === 'uwong', player);
      console.log(`Move:`, move, `Score:`, score);

      if (player === 'uwong' && score > bestScore) {
        bestScore = score;
        bestMove = move;
      } else if (player === 'macan' && score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    console.log(`Best move for ${player}:`, bestMove);
    return bestMove;
  };

  const minimax = (tempBoard, depth, isMaximizing, player) => {
    console.log(`Minimax called. Depth: ${depth}, isMaximizing: ${isMaximizing}, player: ${player}`);
    if (depth === 0 || checkWinCondition(tempBoard)) {
      const score = evaluateBoard(tempBoard, player);
      console.log(`Terminal state reached. Score: ${score}`);
      return score;
    }

    if (isMaximizing) {
      let maxScore = -Infinity;
      const moves = getAvailableMoves(player);
      console.log(`Maximizing moves for ${player}:`, moves);

      for (const move of moves) {
        const newBoard = simulateMove(tempBoard, move, player);
        const score = minimax(newBoard, depth - 1, false, player);
        console.log(`Move:`, move, `Score:`, score);
        maxScore = Math.max(maxScore, score);
      }

      console.log(`Max score for ${player}:`, maxScore);
      return maxScore;
    } else {
      let minScore = Infinity;
      const moves = getAvailableMoves(switchPlayer(player));
      console.log(`Minimizing moves for ${switchPlayer(player)}:`, moves);

      for (const move of moves) {
        const newBoard = simulateMove(tempBoard, move, switchPlayer(player));
        const score = minimax(newBoard, depth - 1, true, player);
        console.log(`Move:`, move, `Score:`, score);
        minScore = Math.min(minScore, score);
      }

      console.log(`Min score for ${switchPlayer(player)}:`, minScore);
      return minScore;
    }
  };

  const checkWinCondition = (tempBoard) => {
    const uwongCount = tempBoard.filter(piece => piece === 'uwong').length;
    console.log(`Checking win condition. Uwong count: ${uwongCount}`);

    if (uwongCount < 14) {
      console.log('Win condition met: Uwong count < 14');
      return true;
    }

    if (macanPos !== null) {
      // Check regular moves
      const hasValidMove = connections[macanPos].some(to => tempBoard[to] === null);
      if (hasValidMove) {
        console.log('Macan has valid moves. No win condition.');
        return false;
      }

      // Check jump moves
      const jumps = macanJump[macanPos];
      if (jumps) {
        for (const [to, path] of Object.entries(jumps)) {
          if (tempBoard[to] === null && path.every(pos => tempBoard[pos] === 'uwong')) {
            console.log('Macan has valid jump moves. No win condition.');
            return false;
          }
        }
      }

      console.log('Macan has no valid moves. Win condition met.');
      return true; // Macan has no valid moves
    }

    console.log('No win condition met.');
    return false;
  };

  const evaluateBoard = (tempBoard, player) => {
    const uwongCount = tempBoard.filter(piece => piece === 'uwong').length;
    const score = uwongCount < 14 ? -1000 : 1000;
    console.log(`Evaluating board for ${player}. Uwong count: ${uwongCount}, Score: ${score}`);

    if (player === 'uwong') {
      return score + uwongCount;
    } else {
      return -score - uwongCount;
    }
  };

  const getAvailableMoves = (player) => {
    console.log(`Getting available moves for ${player}. Game state: ${gameState}`);
    const moves = [];

    if (gameState === 'initial' && player === 'uwong') {
      for (let row = 1; row <= 3; row++) {
        for (let col = 1; col <= 3; col++) {
          const pos = row * 5 + col;
          if (board[pos] === null) {
            moves.push({ type: 'initial', position: pos });
          }
        }
      }
    } else if (gameState === 'placing') {
      if (player === 'uwong' && uwongPawnsInHand > 0) {
        for (let i = 0; i < board.length; i++) {
          if (board[i] === null) {
            moves.push({ type: 'place', position: i });
          }
        }
      } else if (player === 'macan') {
        for (let i = 0; i < board.length; i++) {
          if (board[i] === null) {
            moves.push({ type: 'place', position: i });
          }
        }
      }
    } else if (gameState === 'moving') {
      if (player === 'uwong') {
        for (let i = 0; i < board.length; i++) {
          if (board[i] === 'uwong') {
            const validMoves = connections[i] || [];
            for (const to of validMoves) {
              if (board[to] === null) {
                moves.push({ type: 'move', from: i, to });
              }
            }
          }
        }
      } else if (player === 'macan') {
        if (board[macanPos] === 'macan') {
          // Regular moves
          const validMoves = connections[macanPos] || [];
          for (const to of validMoves) {
            if (board[to] === null) {
              moves.push({ type: 'move', from: macanPos, to });
            }
          }

          // Jump moves
          const jumps = macanJump[macanPos] || {};
          for (const [to, path] of Object.entries(jumps)) {
            const toNum = parseInt(to);
            if (board[toNum] === null && path.every(pos => board[pos] === 'uwong')) {
              moves.push({ type: 'jump', from: macanPos, to: toNum });
            }
          }
        }
      }
    }

    console.log(`Available moves for ${player}:`, moves);
    return moves;
  };

  const switchPlayer = (player) => {
    const newPlayer = player === 'uwong' ? 'macan' : 'uwong';
    console.log(`Switching player from ${player} to ${newPlayer}`);
    return newPlayer;
  };

  const simulateMove = (tempBoard, move, player) => {
    console.log(`Simulating move for ${player}. Move:`, move);
    const newBoard = [...tempBoard];

    if (move.type === 'initial') {
      const row = Math.floor(move.position / 5);
      const col = move.position % 5;
      const positions = [
        [(row-1)*5 + (col-1), (row-1)*5 + col, (row-1)*5 + (col+1)],
        [row*5 + (col-1), row*5 + col, row*5 + (col+1)],
        [(row+1)*5 + (col-1), (row+1)*5 + col, (row+1)*5 + (col+1)]
      ];
      positions.flat().forEach(pos => {
        if (pos >= 0 && pos < tempBoard.length) {
          newBoard[pos] = 'uwong';
        }
      });
    } else if (move.type === 'place') {
      newBoard[move.position] = player;
    } else if (move.type === 'move') {
      newBoard[move.from] = null;
      newBoard[move.to] = player;
    } else if (move.type === 'jump') {
      newBoard[move.from] = null;
      newBoard[move.to] = player;
      const jumpedPos = macanJump[move.from][move.to];
      for (const p of jumpedPos) {
        newBoard[p] = null;
      }
    }

    console.log(`Board after move:`, newBoard);
    return newBoard;
  };

  useEffect(() => {
    let timeoutId;

    const makeAIMove = async () => {
      if (!win) {
        console.log(`Making AI move for ${currentPlayer}`);
        const move = getAIMove(currentPlayer);
        if (move) {
          console.log(`Executing move:`, move);
          if (move.type === 'initial' || move.type === 'place') {
            handleClick(move.position);
          } else if (move.type === 'move' || move.type === 'jump') {
            setSelectedPiece(move.from);
            await new Promise(resolve => setTimeout(resolve, 500));
            handleClick(move.to);
          }
        }
        timeoutId = setTimeout(makeAIMove, 1000);
      }
    };

    makeAIMove();

    return () => {
      if (timeoutId) {
        console.log('Clearing timeout for AI move');
        clearTimeout(timeoutId);
      }
    };
  }, [currentPlayer, win]);

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
        </div>
      </div>
    </div>
  );
};

export default AIvsAI;
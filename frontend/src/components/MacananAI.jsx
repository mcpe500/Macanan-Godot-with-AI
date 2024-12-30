// AI Implementation for Uwong player using Minimax with Alpha-Beta pruning
const MacananAI = {
    // Maximum depth for minimax search
    MAX_DEPTH: 3,
  
    // Evaluate the current board state from Uwong's perspective
    evaluateBoard: (board, uwongTotal, connections, macanPos) => {
      if (uwongTotal < 14) return -1000; // Losing state for Uwong
      
      // Count how many valid moves Macan has
      const macanMoves = MacananAI.getValidMacanMoves(board, macanPos, connections);
      if (macanMoves.length === 0) return 1000; // Winning state for Uwong
  
      let score = 0;
      
      // Value based on number of Uwong pieces
      score += uwongTotal * 10;
      
      // Penalty for Macan's mobility
      score -= macanMoves.length * 5;
      
      // Bonus for Uwong pieces that are protecting each other
      score += MacananAI.evaluateUwongFormation(board, connections);
      
      return score;
    },
  
    // Evaluate how well Uwong pieces protect each other
    evaluateUwongFormation: (board, connections) => {
      let score = 0;
      
      for (let i = 0; i < board.length; i++) {
        if (board[i] === 'uwong') {
          // Count adjacent Uwong pieces
          const adjacentUwongs = connections[i].filter(pos => board[pos] === 'uwong').length;
          score += adjacentUwongs * 2;
        }
      }
      
      return score;
    },
  
    // Get all valid moves for Uwong pieces
    getValidUwongMoves: (board, connections) => {
      const moves = [];
      
      // Find all Uwong pieces and their possible moves
      for (let i = 0; i < board.length; i++) {
        if (board[i] === 'uwong') {
          connections[i].forEach(to => {
            if (board[to] === null) {
              moves.push({ from: i, to });
            }
          });
        }
      }
      
      return moves;
    },
  
    // Get all valid moves for Macan
    getValidMacanMoves: (board, macanPos, connections, macanJump = null) => {
      const moves = [];
      
      // Regular moves
      connections[macanPos].forEach(to => {
        if (board[to] === null) {
          moves.push({ from: macanPos, to, captures: [] });
        }
      });
      
      // Jump moves
      if (macanJump) {
        for (const [to, path] of Object.entries(macanJump[macanPos] || {})) {
          if (board[to] === null && path.every(pos => board[pos] === 'uwong')) {
            moves.push({ from: macanPos, to: parseInt(to), captures: path });
          }
        }
      }
      
      return moves;
    },
  
    // Make a move on a copy of the board
    makeMove: (board, move, piece) => {
      const newBoard = [...board];
      newBoard[move.from] = null;
      newBoard[move.to] = piece;
      
      // Handle captures for Macan jumps
      if (move.captures) {
        move.captures.forEach(pos => {
          newBoard[pos] = null;
        });
      }
      
      return newBoard;
    },
  
    // Minimax algorithm with alpha-beta pruning
    minimax: (board, depth, alpha, beta, isMaximizing, uwongTotal, connections, macanPos, macanJump) => {
      // Terminal conditions
      if (depth === 0 || uwongTotal < 14 || MacananAI.getValidMacanMoves(board, macanPos, connections, macanJump).length === 0) {
        return {
          score: MacananAI.evaluateBoard(board, uwongTotal, connections, macanPos)
        };
      }
  
      if (isMaximizing) {
        // Uwong's turn (maximizing)
        let bestScore = -Infinity;
        let bestMove = null;
        const moves = MacananAI.getValidUwongMoves(board, connections);
  
        for (const move of moves) {
          const newBoard = MacananAI.makeMove(board, move, 'uwong');
          const result = MacananAI.minimax(newBoard, depth - 1, alpha, beta, false, uwongTotal, connections, macanPos, macanJump);
          
          if (result.score > bestScore) {
            bestScore = result.score;
            bestMove = move;
          }
          
          alpha = Math.max(alpha, bestScore);
          if (beta <= alpha) break;
        }
  
        return { score: bestScore, move: bestMove };
      } else {
        // Macan's turn (minimizing)
        let bestScore = Infinity;
        let bestMove = null;
        const moves = MacananAI.getValidMacanMoves(board, macanPos, connections, macanJump);
  
        for (const move of moves) {
          const newBoard = MacananAI.makeMove(board, move, 'macan');
          const newUwongTotal = uwongTotal - (move.captures ? move.captures.length : 0);
          const result = MacananAI.minimax(newBoard, depth - 1, alpha, beta, true, newUwongTotal, connections, move.to, macanJump);
          
          if (result.score < bestScore) {
            bestScore = result.score;
            bestMove = move;
          }
          
          beta = Math.min(beta, bestScore);
          if (beta <= alpha) break;
        }
  
        return { score: bestScore, move: bestMove };
      }
    },
  
    // Get the best move for Uwong
    getBestMove: (board, uwongTotal, connections, macanPos, macanJump) => {
      const result = MacananAI.minimax(
        board,
        MacananAI.MAX_DEPTH,
        -Infinity,
        Infinity,
        true,
        uwongTotal,
        connections,
        macanPos,
        macanJump
      );
      
      return result.move;
    }
  };
  
  export default MacananAI;
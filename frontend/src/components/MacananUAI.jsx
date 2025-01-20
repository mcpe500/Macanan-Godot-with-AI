const MacananUAI = {
  MIN_UWONG_PIECES: 14,
  MAX_DEPTH: 4,

  getValidMacanMoves: (board, macanPos, connections, macanJump = null) => {
    if (macanPos === null) return [];
    const moves = [];

    if (connections[macanPos]) {
      connections[macanPos].forEach(to => {
        if (board[to] === null) {
          moves.push({ from: macanPos, to, captures: [] });
        }
      });
    }

    if (macanJump && macanJump[macanPos]) {
      for (const [to, path] of Object.entries(macanJump[macanPos])) {
        if (board[to] === null && path.every(pos => board[pos] === 'uwong')) {
          moves.push({ from: macanPos, to: parseInt(to), captures: path });
        }
      }
    }

    return moves;
  },

  evaluateBoard: (board, uwongTotal, connections, macanPos, macanJump) => {
    let score = 0;
    let penalty = 0;

    // Immediate win/loss conditions
    if (uwongTotal < MacananUAI.MIN_UWONG_PIECES) return -10000;
    const macanMoves = MacananUAI.getValidMacanMoves(board, macanPos, connections, macanJump);
    if (macanMoves.length === 0) return 10000;

    // Base score from piece count
    score += uwongTotal * 25;

    // Evaluate blocking Macan's jumps
    score += MacananUAI.evaluateJumpBlocking(board, macanPos, macanJump) * 30;

    // Evaluate Uwong formations that limit Macan's mobility
    score += MacananUAI.evaluateUwongFormations(board, connections) * 20;

    // Penalties for exposed Uwong pieces
    penalty += MacananUAI.evaluateExposedPieces(board, connections, macanPos) * 15;

    // Penalties for unblocked Macan paths
    penalty += MacananUAI.evaluateUnblockedPaths(board, macanPos, connections, macanJump) * 25;

    return score - penalty;
  },

  evaluateJumpBlocking: (board, macanPos, macanJump) => {
    let score = 0;
    if (!macanPos || !macanJump[macanPos]) return score;

    // Check all potential jumps for Macan
    for (const [to, path] of Object.entries(macanJump[macanPos])) {
      if (board[to] === null) {
        // Reward blocking jumps
        const blockingPieces = path.filter(pos => board[pos] === 'uwong').length;
        score += blockingPieces * 10;
      }
    }

    return score;
  },

  evaluateUwongFormations: (board, connections) => {
    let score = 0;

    // Reward Uwong pieces that are adjacent to each other
    for (let i = 0; i < board.length; i++) {
      if (board[i] === 'uwong' && connections[i]) {
        const adjacentUwongs = connections[i].filter(pos => board[pos] === 'uwong').length;
        score += adjacentUwongs * 5;
      }
    }

    return score;
  },

  evaluateUnblockedPaths: (board, macanPos, connections, macanJump) => {
    let penalty = 0;

    // Penalize unblocked paths for Macan
    if (macanPos && connections[macanPos]) {
      connections[macanPos].forEach(to => {
        if (board[to] === null) {
          penalty += 5; // Unblocked move
        }
      });
    }

    if (macanPos && macanJump[macanPos]) {
      for (const [to, path] of Object.entries(macanJump[macanPos])) {
        if (board[to] === null && path.every(pos => board[pos] === 'uwong')) {
          penalty += 10; // Unblocked jump
        }
      }
    }

    return penalty;
  },

  evaluatePathBlocking: (board, macanPos, connections, macanJump) => {
    let score = 0;
    if (!macanPos) return score;
    
    const possiblePaths = MacananUAI.getAllMacanPaths(macanPos, connections);

    for (const path of possiblePaths) {
      const blockingPieces = path.filter(pos => board[pos] === 'uwong');
      
      if (blockingPieces.length >= 2 && blockingPieces.length % 2 === 0) {
        score += 20 * (blockingPieces.length / 2);
      }

      if (blockingPieces.length === path.length) {
        score += 30;
      }
    }

    return score;
  },

  getAllMacanPaths: (macanPos, connections) => {
    if (!macanPos || !connections[macanPos]) return [];
    
    const paths = [];
    const visited = new Set();
    const maxDepth = 4;

    const findPaths = (current, path, depth) => {
      if (depth >= maxDepth) return;
      
      visited.add(current);
      const neighbors = connections[current] || [];

      for (const next of neighbors) {
        if (!visited.has(next)) {
          const newPath = [...path, next];
          paths.push(newPath);
          findPaths(next, newPath, depth + 1);
        }
      }
      visited.delete(current);
    };

    findPaths(macanPos, [macanPos], 0);
    return paths;
  },

  evaluatePairedFormations: (board, connections) => {
    let score = 0;
    const visited = new Set();

    for (let i = 0; i < board.length; i++) {
      if (board[i] === 'uwong' && !visited.has(i)) {
        visited.add(i);
        const adjacentUwongs = connections[i]?.filter(pos => board[pos] === 'uwong') || [];
        
        for (const adj of adjacentUwongs) {
          if (!visited.has(adj)) {
            visited.add(adj);
            score += 10;
            
            const sharedNeighbors = connections[i]?.filter(pos => 
              connections[adj]?.includes(pos)
            ) || [];
            
            if (sharedNeighbors.length > 0) {
              score += 15;
            }
          }
        }
      }
    }

    return score;
  },

  evaluateJumpProtection: (board, macanPos, macanJump) => {
    let score = 0;
    if (!macanPos || !macanJump[macanPos]) return score;

    const jumpPaths = macanJump[macanPos];
    for (const [to, path] of Object.entries(jumpPaths)) {
      const pathPieces = path.filter(pos => board[pos] === 'uwong');
      
      if (pathPieces.length % 2 === 0) {
        score += 25;
      }
      
      if (pathPieces.length === path.length) {
        score += 35;
      }
    }

    return score;
  },

  evaluateUnblockedJumpPaths: (board, macanPos, macanJump) => {
    let penalty = 0;
    if (!macanPos || !macanJump[macanPos]) return penalty;

    const jumpPaths = macanJump[macanPos];
    for (const [to, path] of Object.entries(jumpPaths)) {
      if (board[to] === null) {
        const unprotectedPieces = path.filter(pos => {
          if (board[pos] !== 'uwong') return false;
          const adjacentProtectors = MacananUAI.getAdjacentProtectors(board, pos);
          return adjacentProtectors < 2;
        }).length;

        penalty += unprotectedPieces * 30;
      }
    }

    return penalty;
  },

  getAdjacentProtectors: (board, position) => {
    const adjacent = [-1, 1, -5, 5];
    return adjacent.filter(offset => {
      const pos = position + offset;
      return pos >= 0 && pos < board.length && board[pos] === 'uwong';
    }).length;
  },

  evaluatePositionalControl: (board) => {
    let score = 0;
    const criticalPositions = [12, 6, 7, 8, 16, 17, 18, 11, 13, 23];

    for (const pos of criticalPositions) {
      if (board[pos] === 'uwong') {
        score += 15;
      }
    }

    return score;
  },

  evaluateMobility: (board, connections) => {
    let score = 0;
    
    for (let i = 0; i < board.length; i++) {
      if (board[i] === 'uwong' && connections[i]) {
        const moveOptions = connections[i].filter(pos => board[pos] === null).length;
        score += moveOptions * 2;

        const safeMovesCount = connections[i].filter(pos => {
          if (board[pos] !== null) return false;
          const adjacentUwongs = connections[pos]?.filter(p => board[p] === 'uwong').length || 0;
          return adjacentUwongs >= 2;
        }).length;

        score += safeMovesCount * 3;
      }
    }

    return score;
  },

  evaluateExposedPieces: (board, connections, macanPos) => {
    let penalty = 0;

    // Penalize Uwong pieces that are exposed to capture
    for (let i = 0; i < board.length; i++) {
      if (board[i] === 'uwong' && connections[i]) {
        const adjacentUwongs = connections[i].filter(pos => board[pos] === 'uwong').length;
        if (adjacentUwongs === 0) {
          penalty += 10; // Highly exposed
        } else if (adjacentUwongs === 1) {
          penalty += 5; // Partially exposed
        }
      }
    }

    return penalty;
  },

  getValidUwongMoves: (board, connections) => {
    const moves = [];
    
    for (let i = 0; i < board.length; i++) {
      if (board[i] === 'uwong' && connections[i]) {
        connections[i].forEach(to => {
          if (board[to] === null) {
            moves.push({ from: i, to });
          }
        });
      }
    }

    return moves;
  },

  makeMove: (board, move, piece) => {
    const newBoard = [...board];
    newBoard[move.from] = null;
    newBoard[move.to] = piece;

    if (move.captures) {
      move.captures.forEach(pos => {
        newBoard[pos] = null;
      });
    }

    return newBoard;
  },

  minimax: (board, depth, alpha, beta, isMaximizing, uwongTotal, connections, macanPos, macanJump) => {
    if (depth === 0 || uwongTotal < MacananUAI.MIN_UWONG_PIECES || 
        MacananUAI.getValidMacanMoves(board, macanPos, connections, macanJump).length === 0) {
      return {
        score: MacananUAI.evaluateBoard(board, uwongTotal, connections, macanPos, macanJump)
      };
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      let bestMove = null;
      const moves = MacananUAI.getValidUwongMoves(board, connections);

      for (const move of moves) {
        const newBoard = MacananUAI.makeMove(board, move, 'uwong');
        const result = MacananUAI.minimax(newBoard, depth - 1, alpha, beta, false, uwongTotal, connections, macanPos, macanJump);

        if (result.score > bestScore) {
          bestScore = result.score;
          bestMove = move;
        }

        alpha = Math.max(alpha, bestScore);
        if (beta <= alpha) break;
      }

      return { score: bestScore, move: bestMove };
    } else {
      let bestScore = Infinity;
      let bestMove = null;
      const moves = MacananUAI.getValidMacanMoves(board, macanPos, connections, macanJump);

      for (const move of moves) {
        const newBoard = MacananUAI.makeMove(board, move, 'macan');
        const newUwongTotal = uwongTotal - (move.captures ? move.captures.length : 0);
        const result = MacananUAI.minimax(newBoard, depth - 1, alpha, beta, true, newUwongTotal, connections, move.to, macanJump);

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

  getBestMove: (board, uwongTotal, connections, macanPos, macanJump) => {
    const result = MacananUAI.minimax(
      board,
      MacananUAI.MAX_DEPTH,
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

export default MacananUAI;
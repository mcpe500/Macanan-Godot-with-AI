// AI Implementation for Uwong player using Minimax with Alpha-Beta pruning
const MacananAI = {
    // Maximum depth for minimax search
    MAX_DEPTH: 4,
  
    // Enhanced board evaluation with multiple strategic factors
    evaluateBoard: (board, uwongTotal, connections, macanPos) => {
      if (uwongTotal < 14) return -10000; // Increased penalty for losing state
      
      const macanMoves = MacananAI.getValidMacanMoves(board, macanPos, connections);
      if (macanMoves.length === 0) return 10000; // Increased reward for winning state
      
      let score = 0;
      
      // Base score from piece count
      score += uwongTotal * 15;
      
      // Evaluate formation strength
      score += MacananAI.evaluateUwongFormation(board, connections) * 3;
      
      // Evaluate control of critical positions
      score += MacananAI.evaluatePositionalControl(board) * 2;
      
      // Evaluate protection against Macan jumps
      score += MacananAI.evaluateJumpProtection(board, macanPos) * 4;
      
      // Penalty for exposed pieces
      score -= MacananAI.evaluateExposedPieces(board, connections, macanPos) * 3;
      
      // Mobility evaluation
      score += MacananAI.evaluateMobility(board, connections) * 2;
      
      // Penalty for Macan's mobility (weighted by threat level)
      score -= macanMoves.length * 8;
      
      return score;
    },
    
    // Enhanced formation evaluation
    evaluateUwongFormation: (board, connections) => {
        let score = 0;
        
        for (let i = 0; i < board.length; i++) {
            if (board[i] === 'uwong') {
                const adjacentUwongs = connections[i].filter(pos => board[pos] === 'uwong');
                
                // Reward for adjacent pieces (defensive formation)
                score += adjacentUwongs.length * 3;
                
                // Extra reward for forming triangular formations (stronger defense)
                for (const adj1 of adjacentUwongs) {
                    for (const adj2 of adjacentUwongs) {
                        if (adj1 !== adj2 && connections[adj1].includes(adj2)) {
                            score += 5; // Bonus for triangle formation
                        }
                    }
                }
            }
        }
        
        return score;
    },

    // New: Evaluate control of strategically important positions
    evaluatePositionalControl: (board) => {
        let score = 0;
        const criticalPositions = [
            12, // Center
            6, 7, 8, // Middle row
            16, 17, 18, // Critical connections
            11, 13, // Side connections
        ];
        
        for (const pos of criticalPositions) {
            if (board[pos] === 'uwong') {
                score += 10; // Bonus for controlling critical positions
            }
        }
        
        return score;
    },

    // New: Evaluate protection against Macan jumps
    evaluateJumpProtection: (board, macanPos) => {
        let score = 0;
        const uwongPositions = board.map((cell, index) => cell === 'uwong' ? index : -1).filter(pos => pos !== -1);
        
        for (const pos of uwongPositions) {
            let isProtected = false;
            // Check if piece is protected from jumps
            const adjacentPieces = board.map((cell, index) => 
                cell === 'uwong' && Math.abs(index - pos) === 1 ? index : -1
            ).filter(p => p !== -1);
            
            if (adjacentPieces.length >= 2) {
                isProtected = true;
                score += 8; // Bonus for being protected from jumps
            }
            
            if (!isProtected) {
                score -= 5; // Penalty for being vulnerable to jumps
            }
        }
        
        return score;
    },

    // New: Evaluate exposed pieces that could be captured
    evaluateExposedPieces: (board, connections, macanPos) => {
        let exposedCount = 0;
        
        for (let i = 0; i < board.length; i++) {
            if (board[i] === 'uwong') {
                // Check if piece is isolated and could be jumped over
                const adjacentUwongs = connections[i].filter(pos => board[pos] === 'uwong').length;
                if (adjacentUwongs === 0) {
                    exposedCount += 2; // Heavily penalize isolated pieces
                } else if (adjacentUwongs === 1) {
                    exposedCount += 1; // Smaller penalty for pieces with only one connection
                }
                
                // Check if piece is in direct danger from Macan
                if (connections[macanPos]?.includes(i)) {
                    exposedCount += 3; // Extra penalty for pieces next to Macan
                }
            }
        }
        
        return exposedCount;
    },

    // New: Evaluate mobility and control of the board
    evaluateMobility: (board, connections) => {
        let mobilityScore = 0;
        
        for (let i = 0; i < board.length; i++) {
            if (board[i] === 'uwong') {
                const moveOptions = connections[i].filter(pos => board[pos] === null).length;
                mobilityScore += moveOptions * 2; // Reward for having more move options
                
                // Bonus for pieces that can move to multiple safe spots
                const safeMovesCount = connections[i].filter(pos => {
                    if (board[pos] !== null) return false;
                    const adjacentUwongs = connections[pos].filter(p => board[p] === 'uwong').length;
                    return adjacentUwongs >= 2; // Consider a move safe if supported by other pieces
                }).length;
                
                mobilityScore += safeMovesCount * 3;
            }
        }
        
        return mobilityScore;
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
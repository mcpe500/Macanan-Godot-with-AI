// aiHelpers.js
import { CONNECTIONS, MACAN_JUMP, INITIAL_FORMATION_POSITIONS, WINNING_UWONG_COUNT } from "./constants";
import { checkMacanMovement } from "./logic";


export const evaluateGameState = (board, uwongTotal, macanPos, depth, winner) => {
    let score = 0;

    if (winner === 'macan') return 10000 - depth; // Prioritize faster wins
    if (winner === 'uwong') return -10000 + depth; // Prioritize slower losses for AI (macan)

    // macanPos can be -1 if macan is not placed yet.
    const macanCanMove = macanPos !== -1 && CONNECTIONS[macanPos] ? calculateMacanMobility(macanPos, board) : (macanPos === -1 ? (BOARD_SIZE - INITIAL_FORMATION_POSITIONS.length) : 0) ;

    score -= uwongTotal * 10; // AI wants to reduce Uwong pawns
    score += macanCanMove * 4; // AI wants to maintain mobility

    return score;
};

const calculateMacanMobility = (macanPos, board) => {
    let mobility = 0;
    // Walk moves
    if (CONNECTIONS[macanPos]) {
        mobility += CONNECTIONS[macanPos].filter(neighbor => board[neighbor] === null).length;
    }
    // Jump moves
    if (MACAN_JUMP[macanPos]) {
        mobility += Object.values(MACAN_JUMP[macanPos] || {}).filter(pathData => {
            // Check if pathData is an array (the path to check for uwong)
            // and the target square (key of pathData, implicitly handled by Object.values) is empty
            if (Array.isArray(pathData.path) && board[pathData.targetPos] === null) {
                return pathData.path.every(pos => board[pos] === 'uwong');
            }
            // A more robust check: ensure the structure is what you expect for jumps
            // This depends on how MACAN_JUMP is structured. If MACAN_JUMP[macanPos] gives
            // an object like { target1: [path1], target2: [path2] }, then the original logic was fine.
            // The provided constants.js shows MACAN_JUMP[0] = { 2: new Uint8Array([1]), ... }
            // So the original Object.entries().forEach or Object.values().filter approach on MACAN_JUMP[macanPos] is okay.
            // Let's refine based on the structure MACAN_JUMP[from][to] = path
            return Object.entries(MACAN_JUMP[macanPos]).some(([targetPos, path]) =>
                board[targetPos] === null && path.every(pos => board[pos] === 'uwong')
            );

        }).length;
    }
    return mobility;
};


export const getWinner = (uwongTotal, macanPos, board) => {
    if (uwongTotal < WINNING_UWONG_COUNT) return 'macan';
    // Ensure macanPos is valid and exists in CONNECTIONS before checking movement
    if (macanPos !== null && macanPos !== -1 && CONNECTIONS[macanPos] && !checkMacanMovement(macanPos, board)) return 'uwong';
    return null;
};

export const generatePlacingMacanMoves = (board) => {
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
    return moves;
  };

export const generateMacanMoves = (currentPos, board) => {
    const moves = [];
    if (currentPos === null || currentPos === -1) return moves; // Macan not placed yet

    // Walk moves
    if (CONNECTIONS[currentPos]) {
        CONNECTIONS[currentPos].forEach(neighbor => {
            if (board[neighbor] === null) {
                moves.push({ position: neighbor, captured: [], isJump: false });
            }
        });
    }

    // Jump moves
    if (MACAN_JUMP[currentPos]) {
        Object.entries(MACAN_JUMP[currentPos]).forEach(([targetPosStr, path]) => {
            const targetPos = parseInt(targetPosStr);
            if (board[targetPos] === null && path.every(pos => board[pos] === 'uwong')) {
                moves.push({ position: targetPos, captured: Array.from(path), isJump: true });
            }
        });
    }
    return moves;
};

export const generateUwongMoves = (board, gameState, uwongPawnsInHand) => {
    const moves = [];
    if (gameState === 'initial') {
        // For initial placement, AI can choose any of the 3x3 formation center points
        // These are indices 6,7,8, 11,12,13, 16,17,18
        // The `place3x3Formation` function in context handles the actual 9 pawn placements
        // So here, we just need to provide the center position for the formation.
        const formationCenters = [6, 7, 8, 11, 12, 13, 16, 17, 18];
        formationCenters.forEach(pos => moves.push({position: pos, type: 'initial_formation'}));
        return moves;
    }

    if (gameState === 'placing' && uwongPawnsInHand > 0) {
        board.forEach((cell, index) => {
            if (cell === null) {
                moves.push({ position: index, type: 'place' });
            }
        });
        return moves;
    }

    if (gameState === 'moving' || (gameState === 'placing' && uwongPawnsInHand === 0)) { // Should be 'moving' if no pawns in hand
        board.forEach((cell, index) => {
            if (cell === 'uwong') {
                if (CONNECTIONS[index]) {
                    CONNECTIONS[index].forEach(neighbor => {
                        if (board[neighbor] === null) {
                            moves.push({ from: index, to: neighbor, type: 'move' });
                        }
                    });
                }
            }
        });
        return moves;
    }
    return moves; // Should not happen
};

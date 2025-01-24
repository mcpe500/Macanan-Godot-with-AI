// aiHelpers.js
// import { generateMacanMoves, generateUwongMoves } from './moveGenerators';
// import { CONNECTIONS, MACAN_JUMP, INITIAL_FORMATION_POSITIONS, WINNING_UWONG_COUNT } from './gameConstants';

import { CONNECTIONS, MACAN_JUMP, INITIAL_FORMATION_POSITIONS, WINNING_UWONG_COUNT } from "./constants";
import { checkMacanMovement } from "./logic";


export const evaluateGameState = (board, uwongTotal, macanPos, depth, winner) => {
    let score = 0;

    if (winner === 'macan') return 10000 - depth;
    if (winner === 'uwong') return -10000 + depth;

    const macanCanMove = macanPos !== -1 ? calculateMacanMobility(macanPos, board) : 37 - 9;
    score -= uwongTotal * 10;
    score += macanCanMove * 4;

    return score;
};

const calculateMacanMobility = (macanPos, board) => {
    const walkMoves = CONNECTIONS[macanPos].filter(neighbor => board[neighbor] === null).length;
    const jumpMoves = Object.values(MACAN_JUMP[macanPos] || {}).filter(path =>
        path.every(pos => board[pos] === 'uwong')
    ).length;

    return walkMoves + jumpMoves;
};

export const getWinner = (uwongTotal, macanPos, board) => {
    if (uwongTotal < WINNING_UWONG_COUNT) return 'macan';
    if (macanPos !== null && !checkMacanMovement(macanPos, board)) return 'uwong';
    return null;
};

export const generateMacanMoves = (currentPos, board) => {
    const moves = [];

    // Walk moves
    CONNECTIONS[currentPos]?.forEach(neighbor => {
        if (board[neighbor] === null) {
            moves.push({ position: neighbor, captured: [], isJump: false });
        }
    });

    // Jump moves
    Object.entries(MACAN_JUMP[currentPos] || {}).forEach(([targetPos, path]) => {
        if (board[targetPos] === null && path.every(pos => board[pos] === 'uwong')) {
            moves.push({ position: parseInt(targetPos), captured: path, isJump: true });
        }
    });

    return moves;
};

export const generateUwongMoves = (board, gameState) => {
    if (gameState === 'initial') {
        return INITIAL_FORMATION_POSITIONS.map(position => ({ position }));
    }

    return board.flatMap((cell, index) => {
        if (gameState === 'placing' && cell === null) return { position: index };
        if (gameState === 'moving' && cell === 'uwong') {
            return CONNECTIONS[index]
                ?.filter(neighbor => board[neighbor] === null)
                .map(neighbor => ({ from: index, to: neighbor })) || [];
        }
        return [];
    });
};
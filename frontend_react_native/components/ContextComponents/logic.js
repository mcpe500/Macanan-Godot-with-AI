// gameLogic.js
import { CONNECTIONS, MACAN_JUMP } from "./constants";

export const isValidMove = (from, to) => CONNECTIONS[from]?.includes(to);

export const canMacanJump = (from, to, board) => {
    if (board[to] !== null) return false;
    const path = MACAN_JUMP[from]?.[to];
    return path?.every(pos => board[pos] === 'uwong');
};

export const calculateFormationPositions = (centerPosition) => {
    const row = Math.floor(centerPosition / 5);
    const col = centerPosition % 5;

    return [
        [(row - 1) * 5 + (col - 1), (row - 1) * 5 + col, (row - 1) * 5 + (col + 1)],
        [row * 5 + (col - 1), row * 5 + col, row * 5 + (col + 1)],
        [(row + 1) * 5 + (col - 1), (row + 1) * 5 + col, (row + 1) * 5 + (col + 1)]
    ].flat();
};

export const checkMacanMovement = (macanPos, board) => {
    const walkMoves = CONNECTIONS[macanPos]?.some(neighbor => board[neighbor] === null);
    if (walkMoves) return true;

    // Ensure MACAN_JUMP[macanPos] exists before trying to access its properties
    if (!MACAN_JUMP[macanPos]) return false;

    return Object.entries(MACAN_JUMP[macanPos] || {}).some(([targetPos, path]) =>
        board[targetPos] === null && path.every(pos => board[pos] === 'uwong')
    );
};

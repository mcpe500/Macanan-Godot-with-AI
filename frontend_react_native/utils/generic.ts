import { Connections } from '../components/MacananGameContext'; // Import types from your context file

type Player = 'uwong' | 'macan';
type BoardState = (Player | null)[];

interface MinimaxResult {
  score: number;
  move: [number, number] | null;
}

interface EvaluateParams {
  board: BoardState;
  player: Player;
  macanPos: number | null;
  connections: Connections;
}

interface MinimaxParams extends EvaluateParams {
  depth: number;
  alpha: number;
  beta: number;
  isMaximizing: boolean;
}

export const getPossibleMoves = (
  board: BoardState,
  currentPlayer: Player,
  connections: Connections,
  macanPos: number | null
): [number, number][] => {
  if (currentPlayer === 'uwong') {
    return getPossibleUwongMoves(board, connections);
  }
  if (currentPlayer === 'macan') {
    return getPossibleMacanMoves(board, connections, macanPos);
  }
  return [];
};

const evaluateBoard = ({
  board,
  player,
  macanPos,
  connections,
}: EvaluateParams): number => {
  let score = 0;
  const uwongCount = board.filter(cell => cell === 'uwong').length;

  if (player === 'macan') {
    // Macan strategy
    score = 1000 - uwongCount * 100;

    // Mobility score
    const macanMobilityScore = macanPos !== null
      ? connections[macanPos].filter((pos: number) => board[pos] === null).length
      : 0;
    score += macanMobilityScore * 50;

    // Central position bonus
    const centralPositions = new Set([6, 7, 8, 11, 12, 13, 16, 17, 18]);
    if (macanPos !== null && centralPositions.has(macanPos)) {
      score += 200;
    }
  } else {
    // Uwong strategy
    score = uwongCount * 100;

    // Adjacency bonus
    const uwongPositions = board
      .map((cell, index) => (cell === 'uwong' ? index : -1))
      .filter(pos => pos !== -1);

    const adjacentPairs = uwongPositions.filter(pos =>
      connections[pos].some((adjPos: number) => board[adjPos] === 'uwong')
    ).length;
    score += adjacentPairs * 50;
  }

  return score;
};

const getPossibleUwongMoves = (
  board: BoardState,
  connections: Connections
): [number, number][] => {
  const possibleMoves: [number, number][] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === 'uwong') {
      connections[i].forEach((nextPos: number) => {
        if (board[nextPos] === null) {
          possibleMoves.push([i, nextPos]);
        }
      });
    }
  }
  return possibleMoves;
};

const getPossibleMacanMoves = (
  board: BoardState,
  connections: Connections,
  macanPos: number | null
): [number, number][] => {
  if (macanPos === null) return [];
  const possibleMoves: [number, number][] = [];

  connections[macanPos].forEach((nextPos: number) => {
    if (board[nextPos] === null) {
      possibleMoves.push([macanPos, nextPos]);
    }
  });

  return possibleMoves;
};

const minimax = ({
  board,
  depth,
  alpha,
  beta,
  isMaximizing,
  player,
  macanPos,
  connections,
}: MinimaxParams): MinimaxResult => {
  if (depth === 0) {
    return {
      score: evaluateBoard({ board, player, macanPos, connections }),
      move: null,
    };
  }

  const moves = getPossibleMoves(board, player, connections, macanPos);
  if (moves.length === 0) {
    return { score: isMaximizing ? -Infinity : Infinity, move: null };
  }

  let bestScore = isMaximizing ? -Infinity : Infinity;
  let bestMove: [number, number] | null = null;

  for (const move of moves) {
    const newBoard = [...board];
    newBoard[move[1]] = player;
    if (move[0] !== null) {
      newBoard[move[0]] = null;
    }

    const nextMacanPos = player === 'macan' ? move[1] : macanPos;

    const { score } = minimax({
      board: newBoard,
      depth: depth - 1,
      alpha,
      beta,
      isMaximizing: !isMaximizing,
      player: player === 'macan' ? 'uwong' : 'macan',
      macanPos: nextMacanPos,
      connections,
    });

    if (isMaximizing) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      alpha = Math.max(alpha, score);
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
      beta = Math.min(beta, score);
    }

    if (beta <= alpha) {
      break;
    }
  }

  return { score: bestScore, move: bestMove };
};

export const getBestMove = (
  board: BoardState,
  currentPlayer: Player,
  connections: Connections,
  macanPos: number | null
): [number, number] | null => {
  const depth = 3; // Adjust depth based on performance
  const result = minimax({
    board,
    depth,
    alpha: -Infinity,
    beta: Infinity,
    isMaximizing: true,
    player: currentPlayer,
    macanPos,
    connections,
  });

  return result.move;
};
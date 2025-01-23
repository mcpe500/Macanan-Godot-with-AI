const getPossibleMoves = (board, currentPlayer, connections, macanPos) => {
    if (currentPlayer === 'uwong') {
        return getPossibleUwongMoves(board, connections);
    } else if (currentPlayer === 'macan') {
        return getPossibleMacanMoves(board, connections, macanPos);
    }
    return [];
}

const evaluateBoard = (board, player, macanPos, connections) => {
    let score = 0;
    const uwongCount = board.filter(cell => cell === 'uwong').length;

    if (player === 'macan') {
        // Macan strategy: Try to eat Uwong pieces and maintain mobility
        score = 1000 - (uwongCount * 100); // Less Uwong pieces is better for Macan

        // Add bonus for mobility
        const macanMobilityScore = connections[macanPos].filter(pos => board[pos] === null).length;
        score += macanMobilityScore * 50;

        // Add bonus for central positions (better control)
        const centralPositions = [6, 7, 8, 11, 12, 13, 16, 17, 18];
        if (centralPositions.includes(macanPos)) {
            score += 200;
        }
    } else {
        // Uwong strategy: Maintain piece count and try to trap Macan
        score = uwongCount * 100; // More Uwong pieces is better

        // Add penalty for scattered positions
        const uwongPositions = board.map((cell, index) => cell === 'uwong' ? index : -1).filter(pos => pos !== -1);

        const adjacentPairs = uwongPositions.filter(pos =>
            connections[pos].some(adjPos => board[adjPos] === 'uwong')
        ).length;
        score += adjacentPairs * 50; // Bonus for adjacent Uwong pieces
    }

    return score;
};

const getPossibleUwongMoves = (board, connections) => {
    if (board === null) return [];
    const possibleMoves = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === 'uwong') {
            const connectionsIlength = connections[i].length
            for (let j = 0; j < connectionsIlength; j++) {
                const nextPos = connections[i][j];
                if (board[nextPos] === null) {
                    possibleMoves.push([i, nextPos]);
                }
            }
        }
    }
    return possibleMoves;
}

const getPossibleMacanMoves = (board, connections, macanPos) => {
    console.log("getPossibleMacanMoves:", {board, connections, macanPos})
    if (macanPos === null) return [];
    const possibleMoves = [];
    const connectionsIlength = connections[macanPos].length;
    for (let j = 0; j < connectionsIlength; j++) {
        const nextPos = connections[macanPos][j];
        if (board[nextPos] === null) {
            possibleMoves.push([macanPos, nextPos]);
        }
    }
    return possibleMoves;
};

const minimax = (board, depth, alpha, beta, isMaximizing, player, macanPos, connections) => {
    if (depth === 0) {
        return {score: evaluateBoard(board, player, macanPos, connections)};
    }

    const moves = getPossibleMoves(board, player, connections, macanPos);
    console.log('minimax');
    console.log({moves})
    if (moves.length === 0) {
        return {score: isMaximizing ? -Infinity : Infinity};
    }

    let bestMove = null;
    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (const move of moves) {
        const newBoard = [...board];
        newBoard[move[1]] = player;
        if (move[0] !== null) {
            newBoard[move[0]] = null;
        }

        const nextMacanPos = player === 'macan' ? move[1] : macanPos;
        const {score} = minimax(
            newBoard,
            depth - 1,
            alpha,
            beta,
            !isMaximizing,
            player === 'macan' ? 'uwong' : 'macan',
            nextMacanPos,
            connections
        );

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

    return {score: bestScore, move: bestMove};
};

export const getBestMove = (board, currentPlayer, connections, macanPos) => {
    const depth = 3; // Adjust depth based on performance needs
    const result = minimax(
        board,
        depth,
        -Infinity,
        Infinity,
        true,
        currentPlayer,
        macanPos,
        connections
    );
    return result.move;
};
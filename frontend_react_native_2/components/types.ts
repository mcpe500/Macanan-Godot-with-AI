export type CellType = 'uwong' | 'macan' | null;
export type Player = 'uwong' | 'macan';
export type GameState = 'initial' | 'placing' | 'moving';
export type Position = number;

export interface Move {
    position: number;
    captured: Uint8Array;
    isJump: boolean;
}

export interface UwongMove {
    from?: number;
    to?: number;
    position?: number;
}

export interface Connections {
    [key: number]: Uint8Array;
}

export interface MacanJump {
    [key: number]: {
        [key: number]: Uint8Array;
    };
}

export interface GameContext {
    board: CellType[];
    currentPlayer: Player;
    uwongPawnsInHand: number;
    gameState: GameState;
    selectedPiece: number | null;
    message: string;
    win: boolean;
    winner: Player | null;
    uwongTotal: number;
    macanPos: number | null;
    handleClick: (position: Position) => void;
    handleAIClick: () => void;
    restartGame: () => void;
    goBack: () => void;
}

export type MinimaxResult = {
    score: number;
    move?: Move; // Optional move property
};


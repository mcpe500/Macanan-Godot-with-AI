import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { Svg, Line } from 'react-native-svg';
import { useMacananGame } from './MacananGameContext';

const { width: screenWidth } = Dimensions.get('window');
const CELL_SIZE = Math.max(30, Math.floor(screenWidth / 12));
const PAWN_SIZE = CELL_SIZE * 0.8;
const BOARD_PADDING = 10;

const getPieceColor = (piece) => {
  if (piece === 'uwong') return '#4CAF50'; // Green
  if (piece === 'macan') return '#F44336'; // Red
  return '#E0E0E0'; // Default gray
};

// BoardCell can be simplified as no direct interaction is needed for AI vs AI
const BoardCellDisplay = ({ index, piece }) => {
  return (
    <View style={[styles.cell, { width: CELL_SIZE, height: CELL_SIZE }]}>
      {piece && (
        <View
          style={[
            styles.pawn,
            { backgroundColor: getPieceColor(piece), width: PAWN_SIZE, height: PAWN_SIZE },
          ]}
        />
      )}
      {/* <Text style={styles.cellText}>{index}</Text> */}
    </View>
  );
};

const AIVsAIGame = () => {
  const {
    board,
    message,
    uwongPawnsInHand,
    uwongTotal,
    handleAIMove, // Both players are AI
    win,
    winner,
    goBack,
    restartGame,
    CONNECTIONS,
    selectedPiece, // Though AI selects, context might update it
    currentPlayer,
    gameState,
  } = useMacananGame();

  const [isThinking, setIsThinking] = useState(false);
  const [nodeLayouts, setNodeLayouts] = useState({});
  const mainBoardIndices = Array.from({ length: 25 }, (_, i) => i);
  const leftWingOuterIndices = [25, 27, 29];
  const leftWingInnerIndices = [26, 28, 30];
  const rightWingInnerIndices = [31, 33, 35];
  const rightWingOuterIndices = [32, 34, 36];

  // AI makes a move
  useEffect(() => {
    if (!win) {
      setIsThinking(true);
      const timer = setTimeout(() => {
        handleAIMove();
        setIsThinking(false);
      }, 700); // Slightly longer delay for AI vs AI to make it watchable
      return () => clearTimeout(timer);
    } else {
        setIsThinking(false);
    }
  }, [currentPlayer, win, board]); // Depends on whose turn or if board changed


  const onCellLayout = useCallback((index, layout) => {
    setNodeLayouts(prevLayouts => ({
      ...prevLayouts,
      [index]: { x: layout.x + CELL_SIZE / 2, y: layout.y + CELL_SIZE / 2 },
    }));
  }, []);

  useEffect(() => {
    const layouts = {};
    const wingGap = CELL_SIZE * 4;
    const mainGridBaseX = wingGap + BOARD_PADDING;
    const mainGridBaseY = BOARD_PADDING + CELL_SIZE * 2;

    for(let i=0; i<25; i++) {
        const row = Math.floor(i/5);
        const col = i % 5;
        layouts[i] = { x: mainGridBaseX + col * CELL_SIZE + CELL_SIZE/2, y: mainGridBaseY + row * CELL_SIZE + CELL_SIZE/2 };
    }

    [25, 27, 29].forEach((idx, i) => layouts[idx] = { x: BOARD_PADDING + CELL_SIZE/2, y: mainGridBaseY + i * (CELL_SIZE*1.5) + CELL_SIZE/2});
    [26, 28, 30].forEach((idx, i) => layouts[idx] = { x: BOARD_PADDING + CELL_SIZE * 1.5 + CELL_SIZE/2, y: mainGridBaseY + i * CELL_SIZE + CELL_SIZE * 0.5 + CELL_SIZE/2 });

    const rightWingBaseX = mainGridBaseX + 5 * CELL_SIZE + wingGap/2;
    [31, 33, 35].forEach((idx,i) => layouts[idx] = {x: rightWingBaseX - CELL_SIZE*1.5 + CELL_SIZE/2, y: mainGridBaseY + i * CELL_SIZE + CELL_SIZE*0.5 + CELL_SIZE/2});
    [32, 34, 36].forEach((idx,i) => layouts[idx] = {x: rightWingBaseX + CELL_SIZE/2, y: mainGridBaseY + i * (CELL_SIZE*1.5) + CELL_SIZE/2});
    setNodeLayouts(layouts);
  }, [screenWidth]);

  const renderBoardStructure = (indices) => {
    return indices.map((index) => (
      <View key={index}>
        <BoardCellDisplay
          index={index}
          piece={board[index]}
        />
      </View>
    ));
  };

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.gameContainer}>
        <Text style={styles.messageText}>{message}</Text>
        <Text style={styles.statusText}>Current Player: {currentPlayer.toUpperCase()} ({gameState})</Text>
        {isThinking && !win && <ActivityIndicator size="small" color="#0000ff" style={{marginVertical: 5}}/>}
        <Text style={styles.statusText}>Uwong in hand: {uwongPawnsInHand}</Text>
        <Text style={styles.statusText}>Uwong on board: {uwongTotal - uwongPawnsInHand}</Text>

        <View style={styles.boardOuterContainer}>
            <View style={styles.svgContainer}>
                <Svg height="100%" width="100%">
                {Object.keys(nodeLayouts).length > 0 && CONNECTIONS && Object.entries(CONNECTIONS).map(([from, toArray]) =>
                    toArray.map(to => {
                    const fromNode = nodeLayouts[from];
                    const toNode = nodeLayouts[to];
                    if (fromNode && toNode) {
                        return (
                        <Line
                            key={`${from}-${to}`}
                            x1={fromNode.x}
                            y1={fromNode.y}
                            x2={toNode.x}
                            y2={toNode.y}
                            stroke="#B0BEC5"
                            strokeWidth="2"
                        />
                        );
                    }
                    return null;
                    })
                )}
                </Svg>
            </View>

            <View style={styles.boardCellsContainer}>
                <View style={styles.wingColumn}>{renderBoardStructure(leftWingOuterIndices)}</View>
                <View style={styles.wingColumn}>{renderBoardStructure(leftWingInnerIndices)}</View>
                <View style={styles.mainGrid}>
                    {mainBoardIndices.map(index => (
                        <View key={index} style={{width: CELL_SIZE, height: CELL_SIZE}}>
                            <BoardCellDisplay
                                index={index}
                                piece={board[index]}
                            />
                        </View>
                    ))}
                </View>
                 <View style={styles.wingColumn}>{renderBoardStructure(rightWingInnerIndices)}</View>
                <View style={styles.wingColumn}>{renderBoardStructure(rightWingOuterIndices)}</View>
            </View>
        </View>

        {win && (
          <View style={styles.winContainer}>
            <Text style={styles.winText}>{winner ? `${winner.toUpperCase()} WINS!` : "Game Over!"}</Text>
            <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.button, styles.goBackButton]} onPress={goBack}>
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.restartButton]} onPress={restartGame}>
                    <Text style={styles.buttonText}>Restart</Text>
                </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1, backgroundColor: '#F5F5F5' },
  gameContainer: { flex: 1, alignItems: 'center', paddingVertical: 20, paddingHorizontal: BOARD_PADDING },
  messageText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#333' },
  statusText: { fontSize: 14, textAlign: 'center', marginBottom: 5, color: '#555' },
  boardOuterContainer: { width: screenWidth - BOARD_PADDING * 2, height: CELL_SIZE * 7 + BOARD_PADDING * 2, marginTop: 20, marginBottom: 20, position: 'relative'},
  svgContainer: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  boardCellsContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%', height: '100%' },
  wingColumn: { flexDirection: 'column', justifyContent: 'space-around', height: CELL_SIZE * 5 },
  mainGrid: { width: CELL_SIZE * 5, height: CELL_SIZE * 5, flexDirection: 'row', flexWrap: 'wrap' },
  cell: { justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#BDBDBD', borderRadius: CELL_SIZE / 2 },
  // No selectedCell style needed for AI vs AI display
  pawn: { borderRadius: PAWN_SIZE / 2, justifyContent: 'center', alignItems: 'center' },
  // cellText: { fontSize: 10, position: 'absolute' },
  winContainer: { marginTop: 20, alignItems: 'center' },
  winText: { fontSize: 24, fontWeight: 'bold', color: '#D32F2F', marginBottom: 10 },
  buttonRow: { flexDirection: 'row', marginTop: 10 },
  button: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginHorizontal: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 },
  goBackButton: { backgroundColor: '#1976D2' },
  restartButton: { backgroundColor: '#388E3C' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default AIVsAIGame;

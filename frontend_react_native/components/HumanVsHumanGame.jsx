import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Alert } from 'react-native';
import { Svg, Line } from 'react-native-svg';
import { useMacananGame } from './MacananGameContext';

const { width: screenWidth } = Dimensions.get('window');
const CELL_SIZE = Math.max(30, Math.floor(screenWidth / 12)); // Adjust cell size based on screen width
const PAWN_SIZE = CELL_SIZE * 0.8;
const BOARD_PADDING = 10;

// Helper to get piece color
const getPieceColor = (piece) => {
  if (piece === 'uwong') return '#4CAF50'; // Green
  if (piece === 'macan') return '#F44336'; // Red
  return '#E0E0E0'; // Default gray for empty
};

// Component for individual board cells/pieces
const BoardCell = ({ index, piece, onPress, isSelected }) => {
  return (
    <TouchableOpacity
      style={[
        styles.cell,
        { width: CELL_SIZE, height: CELL_SIZE },
        isSelected && styles.selectedCell,
      ]}
      onPress={() => onPress(index)}
    >
      {piece && (
        <View
          style={[
            styles.pawn,
            { backgroundColor: getPieceColor(piece), width: PAWN_SIZE, height: PAWN_SIZE },
          ]}
        />
      )}
      {/* <Text style={styles.cellText}>{index}</Text> */}
    </TouchableOpacity>
  );
};

const HumanVsHumanGame = () => {
  const {
    board,
    message,
    uwongPawnsInHand,
    uwongTotal,
    handleClick, // Use the context's handleClick
    win,
    winner,
    goBack,
    restartGame,
    CONNECTIONS, // Get connections for drawing lines
    selectedPiece, // To highlight selected piece
    currentPlayer,
    gameState
  } = useMacananGame();

  // Layout positions for SVG lines. This is a simplified version.
  // A more robust solution would calculate these dynamically based on cell render positions.
  const [nodeLayouts, setNodeLayouts] = useState({});

  // Define the board structure for rendering
  // This needs to match the visual layout of the game board in the web version
  const mainBoardIndices = Array.from({ length: 25 }, (_, i) => i); // 0-24
  const leftWingOuterIndices = [25, 27, 29];
  const leftWingInnerIndices = [26, 28, 30];
  const rightWingInnerIndices = [31, 33, 35]; // Corrected based on typical symmetric board
  const rightWingOuterIndices = [32, 34, 36]; // Corrected

  // This callback will be used by each cell to report its layout
  const onCellLayout = useCallback((index, layout) => {
    setNodeLayouts(prevLayouts => ({
      ...prevLayouts,
      [index]: { x: layout.x + CELL_SIZE / 2, y: layout.y + CELL_SIZE / 2 },
    }));
  }, []);


  const renderBoardStructure = (indices, wingType = "") => {
    return indices.map((index) => (
      <View key={index} onLayout={(event) => {
          // This onLayout gives position relative to its parent.
          // For SVG lines, we need positions relative to the Svg component.
          // This requires careful management of parent View layouts or using measure.
          // For simplicity, direct onLayout is used, assuming parent structure is managed.
          // A more complex app might need a dedicated layout calculation phase.
           const {x, y} = event.nativeEvent.layout;
            // A placeholder for actual layout logic.
            // This will require the BoardCell to be wrapped or for BoardCell itself to report its absolute position.
            // For now, we'll assume a grid-like calculation for nodeLayouts for line drawing.
            // This part is non-trivial for dynamic layouts.
            // The current onCellLayout is a prop for BoardCell if we pass it down.
            // For this example, nodeLayouts will be populated approximately.
      }}>
        <BoardCell
          index={index}
          piece={board[index]}
          onPress={handleClick}
          isSelected={selectedPiece === index}
          // onCellLayout={onCellLayout} // If BoardCell was to report its layout
        />
      </View>
    ));
  };

  // Approximate calculation of node positions for line drawing
  // This is a simplified version and would need to be accurate based on the actual layout
  useEffect(() => {
    const layouts = {};
    const wingGap = CELL_SIZE * 4; // visual spacing
    const mainGridBaseX = wingGap + BOARD_PADDING;
    const mainGridBaseY = BOARD_PADDING + CELL_SIZE * 2; // Adjusted for visual centering

    // Main 5x5 grid (indices 0-24)
    for(let i=0; i<25; i++) {
        const row = Math.floor(i/5);
        const col = i % 5;
        layouts[i] = { x: mainGridBaseX + col * CELL_SIZE + CELL_SIZE/2, y: mainGridBaseY + row * CELL_SIZE + CELL_SIZE/2 };
    }

    // Approximate positions for wings - this needs careful mapping to the visual structure
    // Left Wing Outer [25, 27, 29]
    [25, 27, 29].forEach((idx, i) => layouts[idx] = { x: BOARD_PADDING + CELL_SIZE/2, y: mainGridBaseY + i * (CELL_SIZE*1.5) + CELL_SIZE/2});
    // Left Wing Inner [26, 28, 30]
    [26, 28, 30].forEach((idx, i) => layouts[idx] = { x: BOARD_PADDING + CELL_SIZE * 1.5 + CELL_SIZE/2, y: mainGridBaseY + i * CELL_SIZE + CELL_SIZE * 0.5 + CELL_SIZE/2 });

    const rightWingBaseX = mainGridBaseX + 5 * CELL_SIZE + wingGap/2;
    // Right Wing Inner [31, 33, 35] (Indices adjusted to match typical board)
    [31, 33, 35].forEach((idx,i) => layouts[idx] = {x: rightWingBaseX - CELL_SIZE*1.5 + CELL_SIZE/2, y: mainGridBaseY + i * CELL_SIZE + CELL_SIZE*0.5 + CELL_SIZE/2});
    // Right Wing Outer [32, 34, 36]
    [32, 34, 36].forEach((idx,i) => layouts[idx] = {x: rightWingBaseX + CELL_SIZE/2, y: mainGridBaseY + i * (CELL_SIZE*1.5) + CELL_SIZE/2});

    setNodeLayouts(layouts);
  }, [screenWidth]);


  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.gameContainer}>
        <Text style={styles.messageText}>{message}</Text>
        <Text style={styles.statusText}>Current Player: {currentPlayer.toUpperCase()} ({gameState})</Text>
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
                            stroke="#B0BEC5" // Light gray lines
                            strokeWidth="2"
                        />
                        );
                    }
                    return null;
                    })
                )}
                </Svg>
            </View>

            {/* This View will contain the actual touchable cells, positioned over the SVG */}
            <View style={styles.boardCellsContainer}>
                {/* Left Wings */}
                <View style={styles.wingColumn}>
                    {renderBoardStructure(leftWingOuterIndices, "leftOuter")}
                </View>
                <View style={styles.wingColumn}>
                    {renderBoardStructure(leftWingInnerIndices, "leftInner")}
                </View>
                {/* Main Grid */}
                <View style={styles.mainGrid}>
                    {mainBoardIndices.map(index => (
                        <View key={index} style={{width: CELL_SIZE, height: CELL_SIZE}}>
                             <BoardCell
                                index={index}
                                piece={board[index]}
                                onPress={handleClick}
                                isSelected={selectedPiece === index}
                            />
                        </View>
                    ))}
                </View>
                {/* Right Wings */}
                 <View style={styles.wingColumn}>
                    {renderBoardStructure(rightWingInnerIndices, "rightInner")}
                </View>
                <View style={styles.wingColumn}>
                    {renderBoardStructure(rightWingOuterIndices, "rightOuter")}
                </View>
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
  screenContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Light gray background
  },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: BOARD_PADDING,
  },
  messageText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  statusText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
    color: '#555',
  },
  boardOuterContainer: {
    width: screenWidth - BOARD_PADDING * 2,
    // Approximate height, this needs to be dynamic or sufficiently large
    height: CELL_SIZE * 7 + BOARD_PADDING * 2,
    marginTop: 20,
    marginBottom: 20,
    position: 'relative', // For SVG and cells to overlap
    // borderWidth:1, borderColor:'blue'
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    // borderWidth:1, borderColor:'red',
  },
  boardCellsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribute wings and main grid
    alignItems: 'center', // Align items vertically in the center of their row/column group
    width: '100%',
    height: '100%', // Take full height of boardOuterContainer
    // borderWidth:1, borderColor:'green'
  },
  wingColumn: {
    flexDirection: 'column',
    justifyContent: 'space-around', // Distribute cells within the column
    height: CELL_SIZE * 5, // Approximate height of the main grid area
    // marginRight: CELL_SIZE / 2, // Spacing
    // marginLeft: CELL_SIZE / 2,
  },
  mainGrid: {
    width: CELL_SIZE * 5,
    height: CELL_SIZE * 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BDBDBD', // Cell border
    borderRadius: CELL_SIZE / 2, // Make it circular if CELL_SIZE is for square, else adjust
  },
  selectedCell: {
    borderColor: '#2196F3', // Blue border for selected
    borderWidth: 3,
  },
  pawn: {
    borderRadius: PAWN_SIZE / 2, // Circular pawn
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: { // For debugging index
    fontSize: 10,
    position: 'absolute',
  },
  winContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  winText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F', // Red for win text
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  goBackButton: {
    backgroundColor: '#1976D2', // Blue
  },
  restartButton: {
    backgroundColor: '#388E3C', // Green
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HumanVsHumanGame;

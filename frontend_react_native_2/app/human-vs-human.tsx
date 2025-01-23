import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useMacananGame } from '@/components/MacananGameContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Svg, Line } from 'react-native-svg';

const HumanVsHumanGame = () => {
  const {
    board,
    message,
    uwongPawnsInHand,
    uwongTotal,
    boardRef, // In React Native, refs are handled differently for layout calculations if needed. Consider if boardRef is necessary for layout in RN.
    handleInitialPlacement,
    handleMacanPlacement,
    handlePawnMove,
    renderLines, // Assuming this is adapted for React Native SVG
    win,
    resetGame,
    setGameState,
  } = useMacananGame();

  const handleClick = (index: number) => {
    if (win) return;
    if (board[index] === null) {
      if (uwongPawnsInHand > 0) {
        handleInitialPlacement(index);
      } else if (board.filter(x => x === 'macan').length === 0) {
        handleMacanPlacement(index);
      }
    } else {
      handlePawnMove(index);
    }
  };

  const restartGame = () => {
    resetGame();
    setGameState('initial');
  };

  const goBack = () => {
    setGameState('initial');
  };

  console.log({
    board,
    message,
    uwongPawnsInHand,
    uwongTotal,
    boardRef,
    handleClick,
    renderLines,
  });

  return (
    <ThemedView style={styles.container}>
      <View style={styles.boardContainer} ref={boardRef as any}> {/* Adjust ref type if necessary */}
        <Svg style={styles.svgOverlay}>
          {renderLines()}
        </Svg>
        <View style={styles.gameInfoContainer}>
          <ThemedText style={styles.messageText}>{message}</ThemedText>
          <View style={styles.pawnsContainer}>
            {/* Left Wing */}
            <View style={styles.wingContainer}>
              {[25, 27, 29].map((index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleClick(index)}
                  style={[
                    styles.pieceButton,
                    board[index] === 'uwong' ? styles.uwongPiece : (board[index] === 'macan' ? styles.macanPiece : styles.emptyPiece),
                  ]}
                >
                  {/* <Text>{index}</Text>  Remove index display for cleaner UI in RN*/}
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.wingContainer}>
              {[26, 28, 30].map((index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleClick(index)}
                  style={[
                    styles.pieceButton,
                    board[index] === 'uwong' ? styles.uwongPiece : (board[index] === 'macan' ? styles.macanPiece : styles.emptyPiece),
                  ]}
                >
                  {/* <Text>{index}</Text> Remove index display for cleaner UI in RN */}
                </TouchableOpacity>
              ))}
            </View>

            {/* Main 5x5 Grid */}
            <View style={styles.mainGridContainer}>
              {Array(25).fill(null).map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleClick(index)}
                  style={[
                    styles.pieceButton,
                    board[index] === 'uwong' ? styles.uwongPiece : (board[index] === 'macan' ? styles.macanPiece : styles.emptyPiece),
                  ]}
                >
                  {/* <Text>{index}</Text> Remove index display for cleaner UI in RN */}
                </TouchableOpacity>
              ))}
            </View>

            {/* Right Wing */}
            <View style={styles.wingContainer}>
              {[31, 33, 35].map((index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleClick(index)}
                  style={[
                    styles.pieceButton,
                    board[index] === 'uwong' ? styles.uwongPiece : (board[index] === 'macan' ? styles.macanPiece : styles.emptyPiece),
                  ]}
                >
                  {/* <Text>{index}</Text> Remove index display for cleaner UI in RN */}
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.wingContainer}>
              {[32, 34, 36].map((index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleClick(index)}
                  style={[
                    styles.pieceButton,
                    board[index] === 'uwong' ? styles.uwongPiece : (board[index] === 'macan' ? styles.macanPiece : styles.emptyPiece),
                  ]}
                >
                  {/* <Text>{index}</Text> Remove index display for cleaner UI in RN */}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.infoTextContainer}>
            <ThemedText style={styles.infoText}>Remaining Unused Uwong pawns: {uwongPawnsInHand}</ThemedText>
          </View>
          <View style={styles.infoTextContainer}>
            <ThemedText style={styles.infoText}>Total Uwong pawns: {uwongTotal}</ThemedText>
          </View>

          {win && (
            <View style={styles.winButtonsContainer}>
              <TouchableOpacity
                onPress={goBack}
                style={styles.winButton}
              >
                <ThemedText style={styles.winButtonText}>Go Back</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={restartGame}
                style={styles.winButton}
              >
                <ThemedText style={styles.winButtonText}>Restart</ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // Adjust background color as needed
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardContainer: {
    width: '90%', // Adjust board width as needed
    maxWidth: 400, // Maximum width for larger screens
    aspectRatio: 1, // Ensure it's a square
    position: 'relative', // To position SVG overlay
  },
  svgOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 0, // Ensure it's behind the buttons
  },
  gameInfoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10, // Spacing between elements
  },
  messageText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  pawnsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  wingContainer: {
    gap: 10,
  },
  mainGridContainer: {
    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', // Not directly applicable in RN styles
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 5 * 40 + 4 * 8, // 5 buttons * 40 width + 4 gaps * 8 width, adjust as needed, assuming pieceButton size is 40 and gap is 8
    justifyContent: 'center',
  },
  pieceButton: {
    width: 40, // Adjust piece button size
    height: 40,
    borderRadius: 20,
    backgroundColor: 'gray',
    margin: 4, // Adjust spacing between buttons
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Ensure pieces are above the svg
  },
  emptyPiece: {
    backgroundColor: '#d4d4d4', // Light gray for empty spots
  },
  uwongPiece: {
    backgroundColor: 'green',
  },
  macanPiece: {
    backgroundColor: 'red',
  },
  infoTextContainer: {
    marginTop: 10,
  },
  infoText: {
    fontSize: 16,
  },
  winButtonsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
  },
  winButton: {
    backgroundColor: 'blue', // Example button style
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  winButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HumanVsHumanGame;

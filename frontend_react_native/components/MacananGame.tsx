import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { useMacananGame } from './MacananGameContext';
import type { StyleProp, ViewStyle } from 'react-native';
import useRegisterNavigator from './useRegisterNavigator';

// Define component props if needed in future
interface MacananGameProps {}

const MacananGame: React.FC<MacananGameProps> = () => {
  const {
    board,
    currentPlayer,
    message,
    uwongPawnsInHand,
    uwongTotal,
    nodePositions,
    boardRef,
    handleClick,
    renderConnections,
    win,
    winner,
    selectedPiece
  } = useMacananGame();

  // Calculate responsive dimensions
  const screenWidth = Dimensions.get('window').width;
  const boardSize = Math.min(screenWidth * 0.9, 600);

  // Helper function to combine styles with type safety
  const getNodeStyle = (index: number): StyleProp<ViewStyle> => {
    const baseStyles: StyleProp<ViewStyle>[] = [styles.node];
    
    if (board[index] === 'uwong') {
      baseStyles.push(styles.uwongNode);
    } else if (board[index] === 'macan') {
      baseStyles.push(styles.macanNode);
    }
    
    if (selectedPiece === index) {
      baseStyles.push(styles.selectedNode);
    }
    
    return baseStyles;
  };

  const renderGameBoard = () => {
    return (
      <View style={styles.boardLayout}>
        {/* Left Wing */}
        <View style={styles.wing}>
          {[25, 26, 27, 28, 29, 30].map((index) => (
            <TouchableOpacity
              key={index}
              style={getNodeStyle(index)}
              onPress={() => handleClick(index)}
            >
              <Text style={styles.nodeText}>{index}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Grid */}
        <View style={styles.mainGrid}>
          {Array.from({ length: 25 }).map((_, index) => (
            <TouchableOpacity
              key={index}
              style={getNodeStyle(index)}
              onPress={() => handleClick(index)}
            >
              <Text style={styles.nodeText}>{index}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Right Wing */}
        <View style={styles.wing}>
          {[31, 32, 33, 34, 35, 36].map((index) => (
            <TouchableOpacity
              key={index}
              style={getNodeStyle(index)}
              onPress={() => handleClick(index)}
            >
              <Text style={styles.nodeText}>{index}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.boardContainer, { width: boardSize }]} ref={boardRef}>
        {/* Game Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.messageText}>
            {win ? `Game Over - ${winner?.toUpperCase()} Wins!` : message}
          </Text>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              Uwong Pawns: {uwongTotal} (In hand: {uwongPawnsInHand})
            </Text>
            <Text style={styles.statsText}>
              Current Turn: {currentPlayer.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Game Board with Connections */}
        <View style={styles.gameBoardContainer}>
          {renderConnections()}
          {renderGameBoard()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boardContainer: {
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    elevation: 4, // Android shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  messageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  statsContainer: {
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  gameBoardContainer: {
    flex: 1,
    position: 'relative',
  },
  boardLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wing: {
    width: '20%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  mainGrid: {
    width: '50%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignContent: 'space-around',
  },
  node: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    ...Platform.select({
      ios: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
      },
      android: {
        elevation: 5,
      },
    }),
  },
  nodeText: {
    fontSize: 12,
    color: '#333333',
  },
  uwongNode: {
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#388E3C',
  },
  macanNode: {
    backgroundColor: '#F44336',
    borderWidth: 2,
    borderColor: '#D32F2F',
  },
  selectedNode: {
    borderWidth: 3,
    borderColor: '#FFC107',
  },
});

export default MacananGame;
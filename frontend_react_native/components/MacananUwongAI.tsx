import React, { useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Line } from 'react-native-svg';
import { useMacananGame } from './MacananGameContext';
import useRegisterNavigator from './useRegisterNavigator';

interface Props {
  navigation: StackNavigationProp<any>;
}

const MacananUwongAI: React.FC<Props> = ({ navigation }) => {
  const {
    board,
    currentPlayer,
    uwongPawnsInHand,
    gameState,
    message,
    win,
    winner,
    uwongTotal,
    handleClick,
    renderConnections,
    nodePositions,
    boardRef,
    setSelectedPiece,
    restartGame
  } = useMacananGame();

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const renderGridButton = (index: number) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.node,
        board[index] === 'uwong' ? styles.uwongNode :
        board[index] === 'macan' ? styles.macanNode : {}
      ]}
      onPress={() => handleClick(index)}
    >
      <Text style={styles.nodeText}>{index}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.boardContainer} ref={boardRef}>
        <Svg style={StyleSheet.absoluteFill}>
          {renderConnections()}
        </Svg>

        <Text style={styles.messageText}>
          {message}
        </Text>

        {/* Main Game Board */}
        <View style={styles.mainBoard}>
          {/* Left Wing */}
          <View style={styles.wingColumn}>
            {[25, 27, 29].map(renderGridButton)}
          </View>
          
          <View style={styles.wingColumn}>
            {[26, 28, 30].map(renderGridButton)}
          </View>

          {/* Main 5x5 Grid */}
          <View style={styles.mainGrid}>
            {Array.from({ length: 5 }).map((_, row) => (
              <View key={row} style={styles.gridRow}>
                {Array.from({ length: 5 }).map((_, col) => {
                  const index = row * 5 + col;
                  return renderGridButton(index);
                })}
              </View>
            ))}
          </View>

          {/* Right Wing */}
          <View style={styles.wingColumn}>
            {[31, 33, 35].map(renderGridButton)}
          </View>
          
          <View style={styles.wingColumn}>
            {[32, 34, 36].map(renderGridButton)}
          </View>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            Remaining Uwong pawns: {uwongPawnsInHand}
          </Text>
          <Text style={styles.statsText}>
            Total Uwong pawns: {uwongTotal}
          </Text>
        </View>

        {win && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={goBack}>
              <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={restartGame}>
              <Text style={styles.buttonText}>Restart</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  mainBoard: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  mainGrid: {
    marginHorizontal: 8,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 4,
  },
  wingColumn: {
    justifyContent: 'space-between',
    marginHorizontal: 4,
  },
  node: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  uwongNode: {
    backgroundColor: '#10b981',
  },
  macanNode: {
    backgroundColor: '#ef4444',
  },
  nodeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1f2937',
  },
  statsContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#374151',
    marginVertical: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 16,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MacananUwongAI;
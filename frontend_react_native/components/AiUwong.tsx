// AiUwongScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useMacananGame } from './MacananGameContext';
import useRegisterNavigator from './useRegisterNavigator';

const AiUwongScreen = () => {
  const {
    board,
    currentPlayer,
    uwongPawnsInHand,
    gameState,
    selectedPiece,
    message,
    win,
    winner,
    uwongTotal,
    macanPos,
    nodePositions,
    boardRef,
    connections,
    macanJump,
    handleClick,
    handleAIClick,
    firstMove,
    renderConnections,
  } = useMacananGame();

  const windowWidth = Dimensions.get('window').width;
  const nodeSize = 40;

  const getNodeStyle = (position: number) => {
    const isSelected = selectedPiece === position;
    const isMacan = board[position] === 'macan';
    const isUwong = board[position] === 'uwong';

    return [
      styles.node,
      {
        width: nodeSize,
        height: nodeSize,
        borderRadius: nodeSize / 2,
      },
      isSelected && styles.selectedNode,
      isMacan && styles.macanNode,
      isUwong && styles.uwongNode,
    ];
  };

  const renderMainGrid = () => {
    return Array(5)
      .fill(null)
      .map((_, row) => (
        <View key={row} style={styles.gridRow}>
          {Array(5)
            .fill(null)
            .map((_, col) => {
              const position = row * 5 + col;
              return (
                <TouchableOpacity
                  key={position}
                  style={getNodeStyle(position)}
                  onPress={() => handleClick(position)}
                >
                  <Text style={styles.nodeText}>{position}</Text>
                </TouchableOpacity>
              );
            })}
        </View>
      ));
  };

  const renderSideNodes = (positions: number[]) => {
    return positions.map((position) => (
      <TouchableOpacity
        key={position}
        style={getNodeStyle(position)}
        onPress={() => handleClick(position)}
      >
        <Text style={styles.nodeText}>{position}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      
      <View style={styles.boardContainer} ref={boardRef}>
        {renderConnections()}
        
        <View style={styles.mainGridContainer}>
          {/* Left Wings */}
          <View style={styles.leftWing}>
            <View style={styles.wingColumn}>{renderSideNodes([25, 27, 29])}</View>
            <View style={styles.wingColumn}>{renderSideNodes([26, 28, 30])}</View>
          </View>

          {/* Main Grid */}
          <View style={styles.mainGrid}>{renderMainGrid()}</View>

          {/* Right Wings */}
          <View style={styles.rightWing}>
            <View style={styles.wingColumn}>{renderSideNodes([31, 33, 35])}</View>
            <View style={styles.wingColumn}>{renderSideNodes([32, 34, 36])}</View>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Remaining Uwong pawns: {uwongPawnsInHand}
        </Text>
        <Text style={styles.statsText}>Total Uwong pawns: {uwongTotal}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainGridContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainGrid: {
    marginHorizontal: 10,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 4,
  },
  node: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  nodeText: {
    color: '#333',
    fontSize: 12,
  },
  selectedNode: {
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  macanNode: {
    backgroundColor: '#ff4444',
  },
  uwongNode: {
    backgroundColor: '#4CAF50',
  },
  leftWing: {
    flexDirection: 'row',
    marginRight: 20,
  },
  rightWing: {
    flexDirection: 'row',
    marginLeft: 20,
  },
  wingColumn: {
    marginHorizontal: 8,
  },
  statsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 16,
    marginVertical: 4,
    color: '#333',
  },
  connectionLine: {
    position: 'absolute',
    backgroundColor: '#888',
  },
});

export default AiUwongScreen;
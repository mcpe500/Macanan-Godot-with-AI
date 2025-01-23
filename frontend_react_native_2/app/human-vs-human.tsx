import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useMacananGame } from '@/components/MacananGameContext';

const GameScreen = () => {
  const {
    board,
    message,
    uwongPawnsInHand,
    uwongTotal,
    handleClick,
    win,
    goBack,
    restartGame,
    renderConnections, // Add renderConnections from context
    boardRef, // Add boardRef from context
  } = useMacananGame();

  const renderPosition = (index: number) => {
    let bgColor = '#e0e0e0'; // Default position color (like bg-gray-200)

    if (board[index] === 'uwong') {
      bgColor = '#4CAF50'; // uwong color (like bg-green-500)
    } else if (board[index] === 'macan') {
      bgColor = '#F44336'; // macan color (like bg-red-500)
    }

    return (
      <TouchableOpacity
        key={index}
        data-position={index}
        style={{ // Inline styles to mimic HumanVsHumanGame.jsx styling
          width: 40, // w-12 in Tailwind (12 * 4px = 48px)
          height: 40, // h-12 in Tailwind
          borderRadius: 24, // rounded-full
          backgroundColor: bgColor,
          justifyContent: 'center',
          alignItems: 'center',
          margin: 4, // gap-4 in parent grid might imply margin: 4
          zIndex: 10, // relative z-10
        }}
        onPress={() => handleClick(index)}
        disabled={win}
      >
        <Text style={{ color: '#666' }}>{index}</Text> {/* positionText style - adjust as needed */}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#f0f0f0', alignItems: 'center', justifyContent: 'center', padding: 20 }}> {/* container style - adjust as needed */}
      <View ref={boardRef} style={{ position: 'relative', width: '100%', maxWidth: 896, marginHorizontal: 'auto' }}> {/* mimicking relative w-full max-w-4xl mx-auto and boardRef application */}
        {/* SVG for connections - ensure react-native-svg is setup */}
        <View style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
          {renderConnections()}
        </View>

        <View style={{ flexDirection: 'column', alignItems: 'center', gap: 20 }}> {/* flex flex-col items-center gap-4 */}
          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 }}>{message}</Text> {/* text-xl font-bold text-center and some margin */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 32 }}> {/* flex justify-center items-center gap-8 */}
            {/* Left Wing */}
            <View style={{ flexDirection: 'column', gap: 80 }}> {/* grid grid-cols-1 gap-20 - vertical gap is larger */}
              {[25, 27, 29].map((index) => renderPosition(index))}
            </View>
            <View style={{ flexDirection: 'column', gap: 16 }}> {/* grid grid-cols-1 gap-4 - vertical gap is smaller */}
              {[26, 28, 30].map((index) => renderPosition(index))}
            </View>

            {/* Main 5x5 Grid */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 250 }}> {/* grid grid-cols-5 gap-4 and width */}
              {Array(25  ).fill(null).map((_, index) => renderPosition(index))}
            </View>

            {/* Right Wing */}
            <View style={{ flexDirection: 'column', gap: 16 }}> {/* grid grid-cols-1 gap-4 - vertical gap is smaller */}
              {[31, 33, 35].map((index) => renderPosition(index))}
            </View>
            <View style={{ flexDirection: 'column', gap: 80 }}> {/* grid grid-cols-1 gap-20 - vertical gap is larger */}
              {[32, 34, 36].map((index) => renderPosition(index))}
            </View>
          </View>
          <View style={{ marginTop: 16, alignItems: 'center' }}> {/* mt-4 and centering */}
            <Text style={{ fontSize: 16 }}>Remaining Unused Uwong pawns: {uwongPawnsInHand}</Text> {/* text-sm */}
            <Text style={{ fontSize: 16 }}>Total Uwong pawns: {uwongTotal}</Text> {/* text-sm */}
          </View>
          {win && (
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 16 }}> {/* flex gap-4 and mt-4 */}
              <TouchableOpacity
                onPress={goBack}
                style={{ backgroundColor: '#2196F3', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 }}> {/* button styles - adjust padding for px-8 py-3 and bg-blue-600 hover:bg-blue-700 etc. */}
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Go Back</Text> {/* buttonText styles - adjust fontSize for text-lg */}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={restartGame}
                style={{ backgroundColor: '#4CAF50', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 }}> {/* button styles - adjust padding for px-8 py-3 and bg-green-600 hover:bg-green-700 etc. */}
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Restart</Text> {/* buttonText styles - adjust fontSize for text-lg */}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  boardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 250,
  },
  wingContainer: {
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  position: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  positionText: {
    color: '#666',
  },
  uwong: {
    backgroundColor: '#4CAF50',
  },
  macan: {
    backgroundColor: '#F44336',
  },
  stats: {
    marginBottom: 20,
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GameScreen;

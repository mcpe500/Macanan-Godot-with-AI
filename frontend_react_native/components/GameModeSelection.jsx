import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const GameModeSelection = () => {
  const navigation = useNavigation();

  const modes = [
    { title: 'Human vs Human', navigateTo: 'HumanVsHuman' },
    { title: 'Human vs AI (Macan)', navigateTo: 'HumanVsAIMacan' },
    { title: 'Human vs AI (Uwong)', navigateTo: 'HumanVsAIUwong' },
    { title: 'AI vs AI', navigateTo: 'AIVsAI' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Which type of game will you play?</Text>
        <Text style={styles.subtitle}>Select a game mode to start.</Text>
        {modes.map((mode) => (
          <TouchableOpacity
            key={mode.navigateTo}
            style={styles.button}
            onPress={() => navigation.navigate(mode.navigateTo)}
          >
            <Text style={styles.buttonText}>{mode.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827', // bg-gray-900
  },
  card: {
    backgroundColor: 'white',
    padding: 32, // Adjusted padding for potentially more buttons
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center', // Center content within the card
  },
  title: {
    fontSize: 22, // Adjusted for mobile
    marginBottom: 16,
    color: '#2563EB', // text-blue-600
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16, // Adjusted for mobile
    marginBottom: 24, // Increased margin before buttons
    color: '#4B5563', // text-gray-600
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2563EB', // bg-blue-600
    paddingHorizontal: 24, // px-8 (adjusted for potentially longer text)
    paddingVertical: 12, // py-3
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 12, // mb-3
    width: '100%', // Make buttons take full width of card area
    minWidth: 250, // Ensure buttons have a minimum width
    alignItems: 'center', // Center text in button
  },
  buttonText: {
    color: 'white',
    fontSize: 16, // text-lg
    textAlign: 'center',
  },
});

export default GameModeSelection;

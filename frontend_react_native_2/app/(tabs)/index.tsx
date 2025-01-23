import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter
import React from 'react';

const Home = () => {
  const router = useRouter(); // Initialize useRouter

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to the Macanan Game</Text>
        <Text style={styles.subtitle}>Get ready for an exciting adventure!</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/game-modes')} // Navigate to /game-modes
        >
          <Text style={styles.buttonText}>Start Game</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // bg-gray-100
    padding: 20, // p-5
  },
  card: {
    backgroundColor: 'white', // bg-white
    borderRadius: 12, // rounded-xl
    padding: 32, // p-8
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    maxWidth: 400,
    width: '100%',
  },
  title: {
    fontSize: 24, // text-2xl
    fontWeight: 'bold', // font-bold
    marginBottom: 16, // mb-4
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16, // text-base
    color: '#717171', // text-gray-500
    marginBottom: 32, // mb-8
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2563eb', // bg-blue-600
    paddingHorizontal: 32, // px-8 (8 * 4 = 32)
    paddingVertical: 12, // py-3 (3 * 4 = 12)
    borderRadius: 8, // rounded-lg
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
    fontSize: 18, // text-lg
    textAlign: 'center',
  },
});

export default Home;
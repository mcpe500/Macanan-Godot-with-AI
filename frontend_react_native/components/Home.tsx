import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import useRegisterNavigator from './useRegisterNavigator';

const Home = () => {
  const { register } = useRegisterNavigator();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to the Macanan Game</Text>
        <Text style={styles.subtitle}>Get ready for an exciting adventure!</Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => register('Option')}
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
    backgroundColor: '#111827', // bg-gray-900
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    padding: 48, // p-12 (12 * 4 = 48)
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
  title: {
    fontSize: 36, // text-4xl
    color: '#2563eb', // text-blue-600
    fontWeight: 'bold',
    marginBottom: 16, // mb-4 (4 * 4 = 16)
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20, // text-xl
    color: '#4b5563', // text-gray-600
    marginBottom: 16, // mb-4
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
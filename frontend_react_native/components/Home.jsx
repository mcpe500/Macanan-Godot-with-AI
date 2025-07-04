import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to the Macanan Game</Text>
        <Text style={styles.subtitle}>Get ready for an exciting adventure!</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('GameModes')} // Updated to navigate
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827', // Equivalent to bg-gray-900
  },
  card: {
    textAlign: 'center',
    backgroundColor: 'white',
    padding: 48, // p-12
    borderRadius: 8, // rounded-lg
    shadowColor: '#000', // shadow-xl (approximated)
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5, // for Android shadow
  },
  title: {
    fontSize: 24, // text-4xl (approximated for mobile)
    marginBottom: 16, // mb-4
    color: '#2563EB', // text-blue-600
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18, // text-xl (approximated for mobile)
    marginBottom: 16, // mb-4
    color: '#4B5563', // text-gray-600
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2563EB', // bg-blue-600
    paddingHorizontal: 32, // px-8
    paddingVertical: 12, // py-3
    borderRadius: 8, // rounded-lg
    shadowColor: '#000', // shadow-md (approximated)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3, // for Android shadow
  },
  buttonText: {
    color: 'white',
    fontSize: 16, // text-lg (approximated for mobile)
    textAlign: 'center',
  },
});

export default Home;

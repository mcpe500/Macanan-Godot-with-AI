import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App'; // Adjust import path as needed
import useRegisterNavigator from './useRegisterNavigator';

type OptionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Option'>;

type Props = {
  navigation: OptionScreenNavigationProp;
};

const Option = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Which type game Will You Play</Text>
        <Text style={styles.subtitle}>Get ready for an exciting adventure!</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonMargin]}
            onPress={() => navigation.navigate('Game')}
          >
            <Text style={styles.buttonText}>2 Player</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonMargin]}
            onPress={() => navigation.navigate('AIMacan')}
          >
            <Text style={styles.buttonText}>Uwong Vs Macan Ai</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonMargin]}
            onPress={() => navigation.navigate('AIUwong')}
          >
            <Text style={styles.buttonText}>Uwong Ai Vs Macan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('AIvsAI')}
          >
            <Text style={styles.buttonText}>AI vs AI</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    padding: 48,
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
  title: {
    fontSize: 36,
    color: '#2563eb',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#4b5563',
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
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
  buttonMargin: {
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default Option;
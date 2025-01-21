import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MacananGameProvider } from './components/MacananGameContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './components/Home';
import Option from './components/Option';
import MacananGame from './components/MacananGame';
import MacananUwongAI from './components/MacananUwongAI';
import AIvsAI from './components/AIvsAI';

const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});

const App = () => {
  return (
    <NavigationContainer>
      <MacananGameProvider>
        <View style={styles.container}>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Option" component={Option} />
            <Stack.Screen name="MacananGame" component={MacananGame} />
            <Stack.Screen name="MacananUwongAI" component={MacananUwongAI} />
            <Stack.Screen name="AIvsAI" component={AIvsAI} />
          </Stack.Navigator>
        </View>
      </MacananGameProvider>
    </NavigationContainer>
  );
};

export default App;
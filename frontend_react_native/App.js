import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MacananGameProvider } from './components/MacananGameContext';

// Import screen components
import HomeScreen from './components/Home';
import GameModeSelectionScreen from './components/GameModeSelection';
import HumanVsHumanGameScreen from './components/HumanVsHumanGame';
import HumanVsAIMacanGameScreen from './components/HumanVsAIMacan';
import HumanVsAIUwongGameScreen from './components/HumanVsAIUwong';
import AIVsAIGameScreen from './components/AIVsAIGame';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <MacananGameProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#111827' }, // bg-gray-900
            headerTintColor: '#ffffff', // White text for header
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Macanan Game Deluxe' }}
          />
          <Stack.Screen
            name="GameModes"
            component={GameModeSelectionScreen}
            options={{ title: 'Select Game Mode' }}
          />
          <Stack.Screen
            name="HumanVsHuman"
            component={HumanVsHumanGameScreen}
            options={{ title: 'Human vs Human' }}
          />
          <Stack.Screen
            name="HumanVsAIMacan"
            component={HumanVsAIMacanGameScreen}
            options={{ title: 'Human vs AI (Macan)' }}
          />
          <Stack.Screen
            name="HumanVsAIUwong"
            component={HumanVsAIUwongGameScreen}
            options={{ title: 'Human vs AI (Uwong)' }}
          />
          <Stack.Screen
            name="AIVsAI"
            component={AIVsAIGameScreen}
            options={{ title: 'AI vs AI' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MacananGameProvider>
  );
};

export default App;

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Option from './components/Option';
import MacananGame from './components/MacananGame';
import Home from './components/Home';
import MacananUwongAI from './components/MacananUwongAI';
import useRegisterNavigator from './components/useRegisterNavigator';

// Define TypeScript types for navigation
export type RootStackParamList = {
  Home: undefined;
  Option: undefined;
  Game: undefined;
  AIUwong: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  // const { register } = useRegisterNavigator(); // You don't need to use register here

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Home Screen' }}
        />
        <Stack.Screen
          name="Option"
          component={Option}
          options={{ title: 'Options' }}
        />
        <Stack.Screen
          name="Game"
          component={MacananGame}
          options={{ title: 'Macanan Game' }}
        />
        <Stack.Screen
          name="AIUwong"
          component={MacananUwongAI}
          options={{ title: 'AI vs Human' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import SettingScreen from './src/screens/SettingScreen';
import ConnectedAppScreen from './src/screens/ConnectedAppScreen';
import AppleHealth from './src/screens/AppleHealth';
import FitbitConnect from './src/screens/FitbitConnect';


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="settings" component={SettingScreen} />
        <Stack.Screen name="connectedapps" component={ConnectedAppScreen} />
        <Stack.Screen name="applehealth" component={AppleHealth} />
        <Stack.Screen name="fitbitconnect" component={FitbitConnect} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

import * as React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';

import HomeScreen from './src/screens/HomeScreen';
import SettingScreen from './src/screens/SettingScreen';
import ConnectedAppScreen from './src/screens/ConnectedAppScreen';
import AppleHealthConnect from './src/screens/AppleHealthConnect';
import FitbitConnect from './src/screens/FitbitConnect';
import SyncSuccess from './src/screens/SyncSuccess';

import ExtraScreen from './src/screens/Extra';

import {AuthProvider} from './src/context/AuthContext';

const Stack = createNativeStackNavigator();

const config = {
  screens: {
    home: '/home',
    settings: {
      path: 'user/:id',
      parse: {
        id: id => `${id}`,
      },
    },
    connectedapps: '/connectedapps/:code',
    fitbitconnect: '/fitbitconnect',
  },
};

const linking = {
  prefixes: ['fitbitdata://'],
  config,
};

function App() {
  return (
    <AuthProvider>
      <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
        <Stack.Navigator>
          <Stack.Screen name="home" component={HomeScreen} />
          <Stack.Screen name="settings" component={SettingScreen} />
          <Stack.Screen name="connectedapps" component={ConnectedAppScreen} />
          <Stack.Screen
            name="applehealthconnect"
            component={AppleHealthConnect}
          />
          <Stack.Screen name="syncsuccess" component={SyncSuccess} />
          <Stack.Screen name="fitbitconnect" component={FitbitConnect} />
          <Stack.Screen name="extra" component={ExtraScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;

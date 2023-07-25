import React, {useState, useEffect, useContext, createContext} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Platform} from 'react-native';
import AuthContext from '../context/AuthContext';

export default function ConnectedAppScreen({route, navigation}) {
  //console.log(route.params);

  const {sync} = useContext(AuthContext);
  console.log(sync.result);

  const checkDevice = () => {
    try {
      if (Platform.OS === 'android') {
        console.log('this is true');
        return true;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isDevice = checkDevice();

  const checkAppleSync = () => {
    try {
      if (sync.result) {
        // Check if the last uploaded date in the database matches todays date
        console.log('true. database last upload date matches todays date');
        navigation.navigate('syncsuccess');
      } else {
        navigation.navigate('applehealthconnect');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fitbitSync = () => {
    try {
      if (sync.result) {
        // Check if the last uploaded date in the database matches todays date
        console.log('true. database last upload date matches todays date');
        navigation.navigate('syncsuccess');
      } else {
        navigation.navigate('fitbitconnect');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.pageHeader}>Connected Apps</Text>

      {!isDevice ? (
        <TouchableOpacity style={styles.button} onPress={checkAppleSync}>
          <Text style={styles.text}>Apple Health</Text>
        </TouchableOpacity>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={fitbitSync}>
        <Text style={styles.text}>Fitbit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('extra');
        }}>
        <Text style={styles.text}>Button</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#ECF0F1',
  },
  sectionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageHeader: {
    marginTop: 0,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  bodyText: {
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 10,
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
  },
  button: {
    width: '80%',
    paddingTop: 2,
    paddingBottom: 2,
    backgroundColor: '#0071bc',
    borderRadius: 3,
    marginTop: 5,
  },
  text: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    padding: 5,
  },
});

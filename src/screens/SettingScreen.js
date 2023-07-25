import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useState, useEffect} from 'react';

export default function SettingScreen({route, navigation}) {
  console.log(route.params);

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.pageHeader}>Settings Page!</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('connectedapps');
        }}>
        <Text style={styles.text}>Go to Connected Apps</Text>
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

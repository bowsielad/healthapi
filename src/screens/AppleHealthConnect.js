import React, {useState, useEffect, useContext, createContext} from 'react';
import {StyleSheet, View, Text, Button, TouchableOpacity} from 'react-native';
import AuthContext from '../context/AuthContext';

import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health';

const AppleHealthConnect = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState();

  const {setSync} = useContext(AuthContext);

  /* Permission options */
  const PERMS = AppleHealthKit.Constants.Permissions;
  const healthKitOptions = {
    permissions: {
      read: [PERMS.Steps, PERMS.StepCount],
      write: [PERMS.Steps, PERMS.StepCount],
    },
  };

  const init = AppleHealthKit.initHealthKit(healthKitOptions, error => {
    /* Called after we receive a response from the system */
    if (error) {
      console.log('[ERROR] Cannot grant permissions!');
      return false;
    }
    console.log('Success');
    return true;

    /* Can now read or write to HealthKit */
  });

  const handlePressGetAuthStatus = async () => {
    AppleHealthKit.getAuthStatus(healthKitOptions, (err, result) => {
      if (err) {
        console.error(err);
      }
      console.log(result);
      setAuthStatus(result);
    });
  };

  // dummy database call
  const fetchDataFromDB = async () => {
    const data = [
      {date: '2023-06-12', steps: 12600},
      {date: '2023-06-11', steps: 14905},
      {date: '2023-06-10', steps: 28000},
    ];
    return data;
  };

  let options = {
    startDate: new Date(2022, 10, 1).toISOString(), // required
    endDate: new Date().toISOString(), // optional; default now
  };

  const fetchData = async () => {
    setIsLoading(true);

    // Check if there is data in the database
    const data = await fetchDataFromDB();

    if (data.length > 0) {
      // Get the most recent date from the data
      const mostRecentDate = data.sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      )[0].date;
      const date = new Date(mostRecentDate);
      date.setMonth(date.getMonth());
      date.setDate(date.getDate());
      options.startDate = date.toISOString();
    }

    AppleHealthKit.getDailyStepCountSamples(options, (err, results) => {
      if (err) {
        console.log(err);
        setIsLoading(false);
        return;
      }

      const result = results.map(item => {
        return {
          date: new Date(item.endDate).toISOString().substring(0, 10),
          steps: item.value,
        };
      });
      console.log(result);

      setSync({result});

      /* A set time out - this could be where we upload the data to our data base */

      setTimeout(() => {
        navigation.navigate('syncsuccess');
        setIsLoading(false);
      }, 5000);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}> Welcome to Apple Health Integration</Text>

      {init ? (
        <>
          <Text style={styles.par}> You Are Not Connected</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={handlePressGetAuthStatus}>
            <Text style={styles.text}>View Permissions Status</Text>
          </TouchableOpacity>

          <Text style={styles.sectionDescription}>
            {JSON.stringify(authStatus, null, 2)}
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.par}> Permissions are Working!</Text>

          <TouchableOpacity style={styles.button} onPress={fetchData}>
            <Text style={styles.text}>Sync Data</Text>
          </TouchableOpacity>
        </>
      )}

      {isLoading ? <Text style={styles.par}>Syncing...</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00a8b5',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
    margin: 10,
  },
  par: {
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
    margin: 10,
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

export default AppleHealthConnect;

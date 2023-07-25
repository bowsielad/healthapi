import React, {useState, useEffect, useContext, createContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Linking,
  Alert,
  TouchableOpacity,
} from 'react-native';
import useFetchOAuth from '../hooks/useFetchOAuthCode';
import AuthContext from '../context/AuthContext';

export default function FitbitConnect({route, navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimitReached, setRateLimitReached] = useState(false);

  let {callFetch, data, loading} = useFetchOAuth();

  const {setSync} = useContext(AuthContext);
  const {sync} = useContext(AuthContext);
  console.log(sync.result);

  // dummy database call
  const fetchDataFromDB = async () => {
    const data = [
      {date: '2023-07-20', steps: 12600},
      {date: '2023-07-19', steps: 14905},
      {date: '2023-07-18', steps: 28000},
    ];
    return data;
  };

  const fetchData = async () => {
    setIsLoading(true);

    // Check if there is data in the database
    const data = await fetchDataFromDB();

    let lastDate;
    if (data.length > 0) {
      const mostRecentDate = data.sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      )[0].date;
      lastDate = new Date(mostRecentDate);
    } else {
      lastDate = new Date('2023-01-28');
    }

    const today = new Date();
    let result = [];
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    for (let i = 0; i < diffDays; i++) {
      const date = new Date(lastDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateString = date.toISOString().split('T')[0];
      const url = `https://api.fitbit.com/1/user/-/activities/date/${dateString}.json`;
      var requestOptions = {
        method: 'POST',
      };
      let {response, data} = await callFetch(url, requestOptions);
      if (response.status === 429) {
        setRateLimitReached(true);
        break;
      }
      let steps = data.summary.steps;
      result.push({date: dateString, steps: steps});
      console.log(result);
    }
    setSync({result});

    /* A set time out - this could be where we upload the data to our data base */

    setTimeout(() => {
      navigation.navigate('syncsuccess');
      setIsLoading(false);
    }, 5000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}> Welcome to Fitbit Integration </Text>

      {data ? (
        <>
          <Text style={styles.par}>
            Fitbit Username: {data?.user?.displayName}
          </Text>
          <Text style={styles.par}> Permissions are Working!</Text>
          <TouchableOpacity style={styles.button} onPress={fetchData}>
            <Text style={styles.text}>Sync Data</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.par}> You Are Not Connected</Text>
          <Text style={styles.text}>Pleae try again.</Text>
        </>
      )}

      {isLoading ? <Text style={styles.par}>Syncing...</Text> : null}
      {rateLimitReached ? (
        <Text style={styles.par}>Rate limit reached try again in 1 hour</Text>
      ) : null}
    </View>
  );
}

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

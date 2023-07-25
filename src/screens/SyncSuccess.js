import React, { useState, useEffect, useContext, createContext } from 'react';
import {StyleSheet, View, Text, Button, FlatList, TouchableOpacity} from 'react-native';
import AuthContext from '../context/AuthContext';

const SyncSuccess = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { sync } = useContext(AuthContext);

 const fetchdata = () => {
  setIsLoading(true);
  try {
    if (sync.result) {
      setIsLoading(false);
      setResults(sync.result);
      console.log(sync.result);
    }
    else{
      console.log("there is no data");
      setIsLoading(true);
      return;
    }
  } catch (error) {
    console.error(error);
  }
}

  useEffect(() => {

    fetchdata();

  }, []);


  return (
 
    <View style={styles.container}>
    <Text style={styles.welcome}> Success!</Text>
    <Text style={styles.par}>You last synced your data on {date.toISOString().substring(0, 10)}</Text>

    <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('home', );}}>
       <Text style={styles.text}>View My Progress</Text>
     </TouchableOpacity>
    
    {isLoading ? (  
      <Text style={styles.par}>Loading...</Text> 
    ) : ( 
      <>
      <Text style={styles.header}>Synced Step Data</Text> 
      <FlatList
      data={results}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
      <View>
        <Text style={styles.par}>{item.date} : {item.steps} steps</Text>
      </View>
        )}
      />
      </>
      
    )}
         

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
   header: {
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
    marginTop: 50,
   },
   button: {
    width: '80%',
    paddingTop: 2,
    paddingBottom: 2,
    backgroundColor: '#fff',
    borderRadius: 3,
    marginTop: 5,
  },
  text: {
    color: '#00a8b5',
    fontSize: 20,
    textAlign: 'center',
    padding: 5,
  },
  });


export default SyncSuccess;

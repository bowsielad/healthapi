import React from 'react';
import {createContext, useState, useEffect} from 'react';

const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [sync, setSync] = useState({});

  //console.log('from authContext: ' + sync.results);

  return (
    <AuthContext.Provider value={{sync, setSync}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

import { authData } from './auth';
import { useState, useEffect } from 'react';
import { getToken } from '../data_source/spotify';

export const useToken = () => {
  const [token, setToken] = useState(authData.token);

  useEffect(() => {
    console.log('has token in state', token);
    console.log('has token in object ', authData.token);
    if (!token) {
      getToken().then((res) => {
        setToken(token);
      });
    }
  }, [authData.token]);

  return token;
};

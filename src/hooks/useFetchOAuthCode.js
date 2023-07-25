import React, {useState, useEffect} from 'react';
import {Linking, Alert} from 'react-native';
import qs from 'qs';
import config from '../screens/config.js';
import {encode, decode} from 'base-64';

const useFetchOAuth = () => {
  const [fitbitAccessToken, setFitbitAccessToken] = useState({});
  const [state, setState] = useState({data: [], loading: false}); // only one data source
  const {data, loading} = state;

  // If user hasn't authed with Fitbit, redirect to Fitbit OAuth Implicit Grant Flow using client app type with code

  const OAuthCode = async () => {
    const oauthurl = `https://www.fitbit.com/oauth2/authorize?${qs.stringify({
      client_id: config.client_id,
      response_type: 'code',
      scope: 'activity profile',
      redirect_uri: 'fitbitdata://fitbitconnect',
      expires_in: '604800',
    })}`;

    const supported = await Linking.canOpenURL(oauthurl);

    if (supported) {
      console.log('Oauth link: ' + oauthurl);
      await Linking.openURL(oauthurl).catch(err =>
        console.error('Error processing linking', err),
      );
    } else {
      Alert.alert(`Don't know how to open this URL: ${oauthurl}`);
    }
  };

  const handleRedirect = event => {
    const url = event.url;
    const code = url.match(/code=([^&#]+)/)[1];
    console.log(`The code parameter is: ${code}`);
    getAccessToken(code);
  };

  //Linking.addEventListener('url', handleRedirect);

  const getAccessToken = async code => {
    const accessTokenUrl = `https://api.fitbit.com/oauth2/token?${qs.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'fitbitdata://fitbitconnect',
      expires_in: '604800',
    })}`;

    const encString = encode(`${config.client_id}:${config.client_secret}`);
    //const encString = 'MjJDNDlCOmEyMDI0MTA5MzEzOTUyMTgwMGNlMDdlYjYzMzgyNzZh';

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${encString}`,
      },
    };

    const response = await fetch(accessTokenUrl, options);
    if (!response.ok) throw Error('Did not receive expected data');
    const data = await response.json();

    console.log(data.refresh_token);
    setFitbitAccessToken({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    });

    //localStorage.setItem('FitbitToken', JSON.stringify(data.access_token))
    //localStorage.setItem('RefreshToken', JSON.stringify(data.refresh_token))
    return getProfile(data.access_token);
  };

  const getProfile = async access_token => {
    fetch('https://api.fitbit.com/1/user/-/profile.json', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
      .then(res => res.json())
      .then(res => {
        //console.log(`res: ${JSON.stringify(res)}`);
        //console.log(res);
        setState({data: res, loading: true});
      })
      .catch(err => {
        console.error('Error: ', err);
      });
  };

  useEffect(() => {
    let isMounted = true;

    const getOAuthCode = async () => {
      try {
        Linking.addEventListener('url', handleRedirect);
        OAuthCode();
        return () => {
          Linking.removeEventListener('url', handleRedirect);
        };
      } catch (err) {
        console.error(err);
      } finally {
        isMounted;
      }
    };

    getOAuthCode();

    return () => (isMounted = false);
  }, []);

  let originalRequest = async (url, config) => {
    url = `${url}`;
    let response = await fetch(url, config);
    let data = await response.json();
    //console.log('ORIGINAL REQUEST DATA:' + JSON.stringify(data))
    //console.log(response)
    return {response, data};
  };

  let callFetch = async (url, config) => {
    console.log(fitbitAccessToken);

    config['headers'] = {
      Authorization: `Bearer ${fitbitAccessToken.accessToken}`,
      'Content-Type': 'application/json',
    };

    //console.log('Before Request');
    let {response, data} = await originalRequest(url, config);
    //console.log(originalRequest(url, config));
    //console.log(response);

    return {response, data};
  };

  return {callFetch, data, loading};
};

export default useFetchOAuth;

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ChromeMessage, Sender } from '../types';
import { getCurrentTabUId, getCurrentTabUrl } from '../chrome/utils';
import { ActionType } from '../types';

export const Home = () => {
  const [url, setUrl] = useState<string>('');
  const [playlistName, setPlaylistName] = useState<string>('testplaylist');
  const [responseFromContent, setResponseFromContent] = useState<string>('');
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [token, setToken] = useState<boolean>(false);

  const { push } = useHistory();

  /**
   * Get current URL
   */
  useEffect(() => {
    getCurrentTabUrl((url) => {
      setUrl(url || 'undefined');
    });
  }, []);

  useEffect(() => {
    chrome.runtime.sendMessage(
      { message: 'getLoginState' },
      function (response) {
        console.log('Response from initial: ', response);
        setSignedIn(response.message);
      }
    );
  }, []);

  useEffect(() => {
    chrome.storage.local.get(['token'], function (result) {
      console.log('Value currently is ' + result.key);
    });
  }, [token]);

  const login = () => {
    console.log("send messate'1'11");
    const message: ChromeMessage = {
      from: Sender.React,
      message: ActionType.LOGIN,
      data: '',
    };
    chrome.runtime.sendMessage(message, function (response) {
      console.log('response is: ', response.message);
      setToken(true);
      setSignedIn(response.message);
    });

    // getCurrentTabUId((id) => {
    //     id && chrome.tabs.sendMessage(
    //         id,
    //         message,
    //         (responseFromContentScript) => {
    //             setResponseFromContent(responseFromContentScript);
    //         });
    // });
  };

  const getSong = () => {
    console.log('sget song');
    const message: ChromeMessage = {
      from: Sender.React,
      message: ActionType.GET_SONG,
      data: '',
    };

    chrome.runtime.sendMessage(message, function (response) {
      console.log('response is: ', response);
    });
  };

  const getPlaylist = () => {
    chrome.storage.local.get(['token'], function (result) {
      console.log('Value currently is ' + result.key);
    });
  };

  const handleChange = (e: any) => {
    console.log(e);
    setPlaylistName(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Home</p>
        <p>URL:</p>
        <p>{url}</p>
        <p>{signedIn ? 'signed in!' : 'not signed in'}</p>
        <p>{token}</p>
        <button onClick={login}>Log in</button>
        <button onClick={getSong}>Get song</button>
        <input value={playlistName} onChange={handleChange} type="text"></input>
        <button onClick={getPlaylist}>Get playlist</button>

        <p>Response from content:</p>
        <p>{responseFromContent}</p>
        <button
          onClick={() => {
            push('/about');
          }}
        >
          About page
        </button>
      </header>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ChromeMessage, Sender } from '../types';
import {
  getCurrentTabUId,
  getCurrentTabUrl,
  getSong,
  getArtist,
} from '../chrome/utils';
import { ActionType } from '../types';

export const Home = () => {
  const [playlistName, setPlaylistName] = useState<string>('testplaylist');
  const [responseFromContent, setResponseFromContent] = useState<string>('');
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [token, setToken] = useState<boolean>(false);
  const [songInfo, setSongInfo] = useState({ song: '', artist: '' });

  const { push } = useHistory();

  useEffect(() => {
    chrome.runtime.sendMessage(
      { message: ActionType.GET_LOGIN_STATE },
      function (response) {
        console.log('Response from initial: ', response);
        setSignedIn(response);
      }
    );
  }, []);

  const login = () => {
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
  };

  const getInfo = () => {
    const message: ChromeMessage = {
      from: Sender.React,
      message: 'report_back',
      data: '',
    };

    getSong((result) => {
      setSongInfo((prevState) => {
        return { ...prevState, song: result[0] };
      });
    });

    getArtist((result) => {
      setSongInfo((prevState) => {
        return { ...prevState, artist: result[0] };
      });
    });
  };

  const getPlaylist = () => {
    const message: ChromeMessage = {
      from: Sender.React,
      message: ActionType.ADD_TO_PLAYLIST,
      data: songInfo,
    };
    chrome.runtime.sendMessage(message, function (response) {});
  };

  const handleChange = (e: any) => {
    console.log(e);
    setPlaylistName(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>Home</p>
        <p>{signedIn ? 'signed in!' : 'not signed in'}</p>
        <p>{token}</p>
        <button onClick={login}>Log in</button>
        <button onClick={getInfo}>Get song</button>
        <p>{songInfo.artist}</p>
        <p>{songInfo.song}</p>
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

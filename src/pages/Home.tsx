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
import { LoginButton } from '../components/Login';
import { GetTrackInfoButton } from '../components/GetTrackInfoButton';
import { AddToPlaylist } from '../components/AddToPlaylist';
import { Error } from '../components/Error';
import { Container, Row, Col } from 'react-bootstrap';

export const Home = () => {
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [songInfo, setSongInfo] = useState({ song: '', artist: '' });
  const [songAdded, setSongAdded] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

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
      setSignedIn(response.message);
    });
  };

  const getInfo = () => {
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

    setSongAdded(false);
  };

  const addToPlaylist = () => {
    const message: ChromeMessage = {
      from: Sender.React,
      message: ActionType.ADD_TO_PLAYLIST,
      data: songInfo,
    };
    chrome.runtime.sendMessage(message, function (response) {
      if (response.success) {
        setSongAdded(response.success);
      } else {
        setErrorMessage(response.content);
      }
    });
  };

  const closeAndResetError = () => {
    setErrorMessage('');
  };

  return (
    <Container>
      <h2>Home</h2>
      <div className="d-grid gap-2">
        <LoginButton signedIn={signedIn} onClick={login} />
        <GetTrackInfoButton trackInfo={songInfo} onClick={getInfo} />
        <AddToPlaylist onClick={addToPlaylist} songAdded={songAdded} />
        <Error message={errorMessage} onClick={closeAndResetError} />
      </div>
    </Container>
  );
};

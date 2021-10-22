import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ChromeMessage, Sender } from '../types';
import { getSong, getArtist } from '../chrome/utils';
import { ActionType } from '../types';
import { LoginButton } from '../components/Login';
import { GetTrackInfoButton } from '../components/GetTrackInfoButton';
import { AddToPlaylist } from '../components/AddToPlaylist';
import { Error } from '../components/Error';
import { Container } from 'react-bootstrap';
import {
  getLoginState,
  getLogin,
  addToPlaylist,
} from '../chrome/content_actions';

export const Home = () => {
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [songInfo, setSongInfo] = useState({ song: '', artist: '' });
  const [songAdded, setSongAdded] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { push } = useHistory();

  useEffect(() => {
    getLoginState((response) => {
      setSignedIn(response);
    });
  }, []);

  const onLogin = () => {
    getLogin((response) => {
      setSignedIn(response.message);
    });
  };

  const onGetInfo = () => {
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

  const onAddToPlaylist = () => {
    addToPlaylist(songInfo, (response) => {
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
        <LoginButton signedIn={signedIn} onClick={onLogin} />
        <GetTrackInfoButton trackInfo={songInfo} onClick={onGetInfo} />
        <AddToPlaylist onClick={onAddToPlaylist} songAdded={songAdded} />
        <Error message={errorMessage} onClick={closeAndResetError} />
      </div>
    </Container>
  );
};

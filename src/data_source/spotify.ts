import { challenge, verifier } from '../cryptoUtils';
import { ChromeMessage, ActionType, Sender, MessageResponse } from '../types';
import { postData, getData } from '../apiUtils';
import { useAppSelector, useAppDispatch } from '../redux/hooks';

import { remove, add } from '../redux/tokenSlice';

const CLIENT_ID = encodeURIComponent('0efe050f6fe046ccb90f4b8464c1edb1');
const RESPONSE_TYPE = encodeURIComponent('code');
const REDIRECT_URI = encodeURIComponent(
  'https://coddndlacciekokgjfeeoiphmhgknhpj.chromiumapp.org/'
);
const PLAYLIST_PRIVATE_SCOPE = encodeURIComponent('playlist-modify-private');
const PLAYLIST_PUBLIC_SCOPE = encodeURIComponent('playlist-modify-public');
const SHOW_DIALOG = encodeURIComponent('true');
const CODE_CHALLENGE_METHOD = encodeURIComponent('S256');
const GRANT_TYPE = encodeURIComponent('authorization_code');
let CODE_CHALLENGE: string;
const CODE_VERIFIER = verifier;
let STATE = '';
let ACCESS_TOKEN = '';
let CODE = '';
const BASE_ADDRESS = 'https://api.spotify.com/v1/search';
const API_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SEARCH_QUERY = 'q';
const SEARCH_TYPE = 'type';
let song;

const launchFlow = () => {
  const endpoint = create_pkce_endpoint();
  chrome.identity.launchWebAuthFlow(
    {
      url: endpoint,
      interactive: true,
    },
    () => {}
  );
};

const init = (redirect_url: any, steaet1: string): MessageResponse => {
  console.log('init');
  if (redirect_url) {
    console.log('redirect urk');
    console.log(redirect_url);
    if (chrome.runtime.lastError) {
      return { content: '123' };
    } else {
      if (redirect_url.includes('callback?error=access_denied')) {
        return { content: '456' };
      } else {
        CODE = redirect_url.substring(
          redirect_url.indexOf('code=') + 5,
          redirect_url.indexOf('state=') - 1
        );
        const state = redirect_url.substring(
          redirect_url.indexOf('state=') + 6
        );
        console.log('code is ', CODE);

        if (state === steaet1) {
          const formData = new URLSearchParams();
          formData.append('client_id', CLIENT_ID);
          formData.append('grant_type', 'authorization_code');
          formData.append('code', CODE);
          formData.append(
            'redirect_uri',
            'https://coddndlacciekokgjfeeoiphmhgknhpj.chromiumapp.org/'
          );
          formData.append('code_verifier', CODE_VERIFIER);

          postData(API_TOKEN_ENDPOINT, formData, '', true).then((res) => {
            if (res.status === 200) {
              res.json().then((data) => {
                console.log('tokendata: ', data);
                add(data.access_token);
                ACCESS_TOKEN = data.access_token;
                /*                 user_signed_in = true;
                 */ return { content: 'user_signed_in ' };
              });
            }
          });
        } else {
          return { content: '789' };
        }
      }
    }
  } else {
    console.log('Redirect failed!');
  }
  return { content: '' };
};

const create_pkce_endpoint = () => {
  STATE = encodeURIComponent(
    'meet' + Math.random().toString(36).substring(2, 15)
  );

  const data = {
    client_id: CLIENT_ID,
    response_type: RESPONSE_TYPE,
    redirect_uri: 'https://coddndlacciekokgjfeeoiphmhgknhpj.chromiumapp.org/',
    state: STATE,
    scope: PLAYLIST_PUBLIC_SCOPE,
    show_dialog: SHOW_DIALOG,
    code_challenge_method: CODE_CHALLENGE_METHOD,
    code_challenge: CODE_CHALLENGE,
  };

  const searchParams = new URLSearchParams(data);

  const url = `https://accounts.spotify.com/authorize?`.concat(
    searchParams.toString()
  );

  console.log(url);

  return url;
};

const getToken = () => {};
const getSong = () => {}; //if no token, get token
const addToPlaylist = () => {};

export { getToken, getSong, addToPlaylist, init };

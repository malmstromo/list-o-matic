import { ChromeMessage, ActionType, Sender } from '../types';
import { postData, getData } from '../apiUtils';
import { getSong, addToPlaylist, getToken, init } from '../data_source/spotify';
import { challenge, verifier } from '../cryptoUtils';
export {};

type MessageResponse = (response?: any) => void;
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
const ACCESS_TOKEN = '';
const CODE = '';
const BASE_ADDRESS = 'https://api.spotify.com/v1/search';
const API_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SEARCH_QUERY = 'q';
const SEARCH_TYPE = 'type';
let song;

const user_signed_in = false;

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

const create_token_endpoint = () => {
  STATE = encodeURIComponent(
    'meet' + Math.random().toString(36).substring(2, 15)
  );

  const pkce_url = `https://accounts.spotify.com/authorize
?client_id=${CLIENT_ID}
&grant_type=${GRANT_TYPE}
&redirect_uri=${REDIRECT_URI}
&code_verifier=${CODE_VERIFIER}
&code=${CODE}
`;

  console.log(pkce_url);

  return pkce_url;
};

const create_search = () => {
  const search = encodeURIComponent('artist:kemmuru track:oon 2');
  const type = encodeURIComponent('track');
  const search_url = `${BASE_ADDRESS}?${SEARCH_QUERY}=${search}&${SEARCH_TYPE}=${type}&limit=1
`;

  console.log(search_url);

  return search_url;
};

const validateSender = (
  message: ChromeMessage,
  sender: chrome.runtime.MessageSender
) => {
  return sender.id === chrome.runtime.id && message.from === Sender.React;
};

const messagesFromReactAppListener = (
  request: ChromeMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: MessageResponse
) => {
  console.log('Got a message!');
  console.log(request.message);

  if (request.message === ActionType.LOGIN) {
    console.log('here');
    if (user_signed_in) {
      console.log('User is already signed in.');
    } else {
      challenge().then((challenge) => {
        CODE_CHALLENGE = challenge;

        const endpoint = create_pkce_endpoint();
        console.log(endpoint);

        chrome.identity.launchWebAuthFlow(
          {
            url: endpoint,
            interactive: true,
          },
          (redirect_url) => {
            const response = init(redirect_url, STATE);
            console.log(response);
            sendResponse(response);
          }
        );
      });
    }

    return true;
  } else if (request.message === ActionType.GET_LOGIN_STATE) {
    sendResponse({ message: user_signed_in });
  } else if (request.message === ActionType.GET_SONG) {
    try {
      const foo = create_search();
      console.log(foo);
      console.log(ACCESS_TOKEN);
      const credentials = ACCESS_TOKEN;
      console.log(credentials);
      getData(foo, credentials).then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            song = data.tracks.items[0].uri;
            console.log(song);
            console.log(data);
          });
        } else {
          console.log(res);
        }
      });
    } catch (e) {
      sendResponse({ message: e });
    }
  } else if (request.message === 'getPlaylist') {
    getData(create_search(), `Bearer ${ACCESS_TOKEN}`).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          song = data.tracks.items[0].uri;
          console.log(song);
          console.log(data);
        });
      }
    });
  }
  return 'foo';
};

/** Fired when the extension is first installed,
 *  when the extension is updated to a new version,
 *  and when Chrome is updated to a new version. */
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[background.js] onInstalled', details);
  alert('[background.js] onInstalled');
});

chrome.runtime.onConnect.addListener((port) => {
  console.log('[background.js] onConnect', port);
  alert('[background.js] onInstalled');
});

chrome.runtime.onStartup.addListener(() => {
  console.log('[background.js] onStartup');
  alert('[background.js] onInstalled');
});

/**
 *  Sent to the event page just before it is unloaded.
 *  This gives the extension opportunity to do some clean up.
 *  Note that since the page is unloading,
 *  any asynchronous operations started while handling this event
 *  are not guaranteed to complete.
 *  If more activity for the event page occurs before it gets
 *  unloaded the onSuspendCanceled event will
 *  be sent and the page won't be unloaded. */
chrome.runtime.onSuspend.addListener(() => {
  console.log('[background.js] onSuspend');
  alert('[background.js] onSuspend');
});

chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

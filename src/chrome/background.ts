import { ChromeMessage, ActionType, Sender } from '../types';
import { postData, getData } from '../apiUtils';
import {
  getSong,
  addToPlaylist,
  getToken,
  getPkceUrl,
  init,
} from '../data_source/spotify';
import { challenge } from '../cryptoUtils';
import { authData } from './auth';
export {};

type MessageResponse = (response?: any) => void;

let user_signed_in = false;

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
        authData.codeChallenge = challenge;
        const authUrl = getPkceUrl();
        console.log(authUrl);

        chrome.identity.launchWebAuthFlow(
          {
            url: authUrl,
            interactive: true,
          },
          (redirect_url) => {
            const response = init(redirect_url);

            console.log(response);
            if (response.content === authData.state) {
              user_signed_in = true;
              const token = getToken();
              console.log(token);
            }
            sendResponse(response);
          }
        );
      });
    }

    return true;
  } else if (request.message === ActionType.GET_LOGIN_STATE) {
    sendResponse({ message: authData.token });
  } else if (request.message === ActionType.GET_SONG) {
    console.log(authData.token);
    sendResponse({ message: authData.token });
  }
  /* try {
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
  } */

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

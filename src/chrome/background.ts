import { ChromeMessage, ActionType, Sender } from '../types';
import { postData, getData } from '../apiUtils';
import {
  getToken,
  getPkceUrl,
  handleRedirect,
  getSong,
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
  //https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/identity/launchWebAuthFlow/
  if (request.message === ActionType.LOGIN) {
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
            const response = handleRedirect(redirect_url);

            if (response.content === authData.state) {
              user_signed_in = true;
              getToken().then((data) => {
                authData.token = data.access_token;
              });
            }
          }
        );
      });
    }
  } else if (request.message === ActionType.GET_LOGIN_STATE) {
    sendResponse(user_signed_in);
  } else if (request.message === ActionType.ADD_TO_PLAYLIST) {
    if (!authData.token) {
      console.log('authdata', authData);
    }
    const { song, artist } = request.data;
    console.log(song);
    console.log(artist);
    getSong(request.data).then((res) => {
      console.log(res.message);
    });
  }

  return true;
};

const handleLogin = () => {
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
        const response = handleRedirect(redirect_url);

        if (response.content === authData.state) {
          user_signed_in = true;
          getToken().then((data) => {
            authData.token = data.access_token;
          });
        }
      }
    );
  });
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

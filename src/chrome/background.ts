import { useState } from 'react';
import { ChromeMessage, Sender } from '../types';
import { postData, getData } from '../apiUtils';
import { challenge, verifier } from '../cryptoUtils';
export {};

type MessageResponse = (response?: any) => void;
const CLIENT_ID = encodeURIComponent('0efe050f6fe046ccb90f4b8464c1edb1');
const RESPONSE_TYPE = encodeURIComponent('code');
const REDIRECT_URI = encodeURIComponent(
  'https://pnmicepippfffcmonbooahkjpfaldhdo.chromiumapp.org/'
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

let user_signed_in = false;

const create_pkce_endpoint = () => {
  STATE = encodeURIComponent(
    'meet' + Math.random().toString(36).substring(2, 15)
  );

  const pkce_url = `https://accounts.spotify.com/authorize
?client_id=${CLIENT_ID}
&response_type=${RESPONSE_TYPE}
&redirect_uri=${REDIRECT_URI}
&state=${STATE}
&scope=${PLAYLIST_PRIVATE_SCOPE} ${PLAYLIST_PUBLIC_SCOPE}
&show_dialog=${SHOW_DIALOG}
&code_challenge_method=${CODE_CHALLENGE_METHOD}
&code_challenge=${CODE_CHALLENGE}
`;

  console.log(pkce_url);

  return pkce_url;
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

  if (request.message === 'login') {
    if (user_signed_in) {
      console.log('User is already signed in.');
    } else {
      challenge().then((challenge) => {
        CODE_CHALLENGE = challenge;
        chrome.identity.launchWebAuthFlow(
          {
            url: create_pkce_endpoint(),
            interactive: true,
          },
          function (redirect_url) {
            console.log(redirect_url);
            if (redirect_url) {
              if (chrome.runtime.lastError) {
                sendResponse({ message: 'fail' });
              } else {
                if (redirect_url.includes('callback?error=access_denied')) {
                  sendResponse({ message: 'fail' });
                } else {
                  CODE = redirect_url.substring(
                    redirect_url.indexOf('code=') + 5,
                    redirect_url.indexOf('state=') - 1
                  );
                  const state = redirect_url.substring(
                    redirect_url.indexOf('state=') + 6
                  );
                  console.log('code is ', CODE);

                  if (state === STATE) {
                    const formData = new URLSearchParams();
                    formData.append('client_id', CLIENT_ID);
                    formData.append('grant_type', 'authorization_code');
                    formData.append('code', CODE);
                    formData.append(
                      'redirect_uri',
                      'https://pnmicepippfffcmonbooahkjpfaldhdo.chromiumapp.org/'
                    );
                    formData.append('code_verifier', CODE_VERIFIER);

                    postData(API_TOKEN_ENDPOINT, formData, '', true).then(
                      (res) => {
                        if (res.status === 200) {
                          res.json().then((data) => {
                            console.log('tokendata: ', data);
                            ACCESS_TOKEN = data.access_token;
                            user_signed_in = true;
                            sendResponse({ message: user_signed_in });
                          });
                        }
                      }
                    );
                  } else {
                    sendResponse({ message: 'fail' });
                  }
                }
              }
            } else {
              console.log('Redirect failed!');
            }
          }
        );
      });
    }

    return true;
  } else if (request.message === 'logout') {
    user_signed_in = false;
    chrome.browserAction.setPopup({ popup: './popup.html' }, () => {
      sendResponse({ message: 'success' });
    });

    return true;
  } else if (request.message === 'getLoginState') {
    sendResponse({ message: user_signed_in });
  } else if (request.message === 'performAction') {
    try {
      const foo = create_search();
      console.log(foo);
      getData(foo, `Bearer ${ACCESS_TOKEN}`).then((res) => {
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

// import { ChromeMessage, Sender } from "../types";
// import { postData, getData } from "../apiUtils";
// export {}

// type MessageResponse = (response?: any) => void
// const CLIENT_ID = encodeURIComponent('0efe050f6fe046ccb90f4b8464c1edb1');
// const RESPONSE_TYPE = encodeURIComponent('token');
// const REDIRECT_URI = encodeURIComponent('https://njaegdaibbcepkhhljhnichdmjdccijp.chromiumapp.org/');
// const PLAYLIST_PRIVATE_SCOPE = encodeURIComponent('playlist-modify-private');
// const PLAYLIST_PUBLIC_SCOPE = encodeURIComponent('playlist-modify-public');
// const SHOW_DIALOG = encodeURIComponent('true');
// let STATE = '';
// let ACCESS_TOKEN = '';
// const BASE_ADDRESS = 'https://api.spotify.com/v1/search'
// const SEARCH_QUERY = 'q'
// const SEARCH_TYPE = 'type'
// let song;

// let user_signed_in = false;

// const create_spotify_endpoint = () => {
//     STATE = encodeURIComponent('meet' + Math.random().toString(36).substring(2, 15));

//     let oauth2_url =
//         `https://accounts.spotify.com/authorize
// ?client_id=${CLIENT_ID}
// &response_type=${RESPONSE_TYPE}
// &redirect_uri=${REDIRECT_URI}
// &state=${STATE}
// &scope=${PLAYLIST_PRIVATE_SCOPE} ${PLAYLIST_PUBLIC_SCOPE}
// &show_dialog=${SHOW_DIALOG}
// `;

//     console.log(oauth2_url);

//     return oauth2_url;
// }

// const create_search = () => {
//     let search = encodeURIComponent('artist:kemmuru track:oon 2')
//     let type = encodeURIComponent('track')
//     let search_url =
//         `${BASE_ADDRESS}?${SEARCH_QUERY}=${search}&${SEARCH_TYPE}=${type}&limit=1
// `;

//     console.log(search_url);

//     return search_url;
// }

// const validateSender = (
//     message: ChromeMessage,
//     sender: chrome.runtime.MessageSender
// ) => {
//     return sender.id === chrome.runtime.id && message.from === Sender.React;
// }

// const messagesFromReactAppListener = (
//     request: ChromeMessage,
//     sender: chrome.runtime.MessageSender,
//     sendResponse: MessageResponse
// ) => {
//     console.log("Got a message!")

//             if (request.message === 'login') {
//             if (user_signed_in) {
//                 console.log("User is already signed in.");
//             } else {
//                 // sign the user in with Spotify
//                 chrome.identity.launchWebAuthFlow({
//                     url: create_spotify_endpoint(),
//                     interactive: true
//                 }, function (redirect_url) {
//                     console.log(redirect_url);
//                     if(redirect_url){
//                         if (chrome.runtime.lastError) {
//                             sendResponse({ message: 'fail' });
//                         } else {
//                             if (redirect_url.includes('callback?error=access_denied')) {
//                                 sendResponse({ message: 'fail' });
//                             } else {
//                                 ACCESS_TOKEN = redirect_url.substring(redirect_url.indexOf('access_token=') + 13);
//                                 ACCESS_TOKEN = ACCESS_TOKEN.substring(0, ACCESS_TOKEN.indexOf('&'));
//                                 let state = redirect_url.substring(redirect_url.indexOf('state=') + 6);

//                                 if (state === STATE) {
//                                     console.log("SUCCESS")
//                                     user_signed_in = true;
//                                     sendResponse({ message: user_signed_in });

//                                     // setTimeout(() => {
//                                     //     ACCESS_TOKEN = '';
//                                     //     user_signed_in = false;
//                                     // }, 3600000);

//                                     // chrome.browserAction.setPopup({ popup: './popup-signed-in.html' }, () => {
//                                     //     sendResponse({ message: 'success' });
//                                     // });
//                                 } else {
//                                     sendResponse({ message: 'fail' });
//                                 }
//                             }
//                         }
//                     } else {
//                         console.log('Redirect failed!')
//                     }
//                 });
//             }

//           return true;
//         } else if (request.message === 'logout') {
//             user_signed_in = false;
//             chrome.browserAction.setPopup({ popup: './popup.html' }, () => {
//                 sendResponse({ message: 'success' });
//             });

//             return true;
//         } else if (request.message === 'getLoginState') {
//             console.log("Got a login state message!!")
//             console.log(user_signed_in);

//             sendResponse({ message: user_signed_in });
//         } else if (request.message === 'performAction') {
//             console.log("perform action with token", ACCESS_TOKEN)
//             getData(create_search(), ACCESS_TOKEN).then(
//                 data => {
//                     song = data.tracks.items[0].uri
//                     console.log(song);
//                     console.log(data);
//         })
//     }
// }

// /** Fired when the extension is first installed,
//  *  when the extension is updated to a new version,
//  *  and when Chrome is updated to a new version. */
// chrome.runtime.onInstalled.addListener((details) => {
//     console.log('[background.js] onInstalled', details);
//     alert('[background.js] onInstalled');
// });

// chrome.runtime.onConnect.addListener((port) => {
//     console.log('[background.js] onConnect', port)
//     alert('[background.js] onInstalled');
// });

// chrome.runtime.onStartup.addListener(() => {
//     console.log('[background.js] onStartup')
//     alert('[background.js] onInstalled');
// });

// /**
//  *  Sent to the event page just before it is unloaded.
//  *  This gives the extension opportunity to do some clean up.
//  *  Note that since the page is unloading,
//  *  any asynchronous operations started while handling this event
//  *  are not guaranteed to complete.
//  *  If more activity for the event page occurs before it gets
//  *  unloaded the onSuspendCanceled event will
//  *  be sent and the page won't be unloaded. */
// chrome.runtime.onSuspend.addListener(() => {
//     console.log('[background.js] onSuspend')
//     alert('[background.js] onSuspend');
// });

// chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

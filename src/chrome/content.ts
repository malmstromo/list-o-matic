import { ChromeMessage, Sender } from '../types';

type MessageResponse = (response?: any) => void;

const main = () => {
  console.log('[content.ts] Main');
  /**
   * Fired when a message is sent from either an extension process or a content script.
   */
  //  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //     chrome.runtime.sendMessage({message: "login"}, function(response) {
  //         console.log(response.farewell);
  //       });
  // })
};

main();

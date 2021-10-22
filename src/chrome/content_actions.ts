import { AnyMxRecord, AnyNaptrRecord } from 'dns';
import { ActionType, ChromeMessage, Sender } from '../types';

export const getLoginState = (callback: (result: any) => void): void => {
  chrome.runtime.sendMessage(
    { message: ActionType.GET_LOGIN_STATE },
    (response) => {
      callback(response);
    }
  );
};

export const getLogin = (callback: (result: any) => void): void => {
  const message: ChromeMessage = {
    from: Sender.React,
    message: ActionType.LOGIN,
    data: '',
  };
  chrome.runtime.sendMessage(message, (response) => {
    console.log('response is: ', response.message);
    callback(response);
  });
};

export const addToPlaylist = (
  data: any,
  callback: (result: any) => void
): void => {
  const message: ChromeMessage = {
    from: Sender.React,
    message: ActionType.ADD_TO_PLAYLIST,
    data: data,
  };
  chrome.runtime.sendMessage(message, (response) => {
    callback(response);
  });
};

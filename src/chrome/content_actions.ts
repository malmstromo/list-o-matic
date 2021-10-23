import { ActionType, ChromeMessage, Sender, TrackInfo } from '../types';

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
    callback(response);
  });
};

export const addToPlaylist = (
  data: TrackInfo,
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

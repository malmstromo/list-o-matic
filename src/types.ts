export enum Sender {
  React,
  Background,
}

export interface ChromeMessage {
  from: Sender;
  data?: any;
  message?: any;
  success?: boolean;
}

export interface MessageResponse {
  content: any;
  success: boolean;
}

export enum ActionType {
  LOGIN,
  GET_SONG,
  ADD_TO_PLAYLIST,
  GET_LOGIN_STATE,
}

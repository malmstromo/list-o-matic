export enum Sender {
  React,
  Content,
}

export interface ChromeMessage {
  from: Sender;
  message: any;
  data: any;
}

export interface MessageResponse {
  content: any;
}

export enum ActionType {
  LOGIN,
  GET_SONG,
  ADD_TO_PLAYLIST,
  GET_LOGIN_STATE,
}

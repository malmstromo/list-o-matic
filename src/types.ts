export enum Sender {
  React,
  Background,
}

//dialog between ui and background
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

export interface FooMessage {
  content: any;
  success: boolean;
}

export interface TrackInfo {
  song: string;
  artist: string;
}

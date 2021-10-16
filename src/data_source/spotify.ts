import { MessageResponse } from '../types';
import { postData, RequestParams, buildParams } from '../apiUtils';
import { authData } from 'src/chrome/auth';

const RESPONSE_TYPE = 'code';
const REDIRECT_URI =
  'https://coddndlacciekokgjfeeoiphmhgknhpj.chromiumapp.org/';
const PLAYLIST_PRIVATE_SCOPE = 'playlist-modify-private';
const PLAYLIST_PUBLIC_SCOPE = 'playlist-modify-public';
const SHOW_DIALOG = 'true';
const GRANT_TYPE = 'authorization_code';
const BASE_ADDRESS = 'https://api.spotify.com/v1/search';
const AUTH_URL = 'https://accounts.spotify.com/authorize?';
const API_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

interface TokenRequestParams extends RequestParams {
  grant_type: string;
  code: string;
  redirect_uri: string;
  code_verifier: string;
}
interface AuthRequestParams extends RequestParams {
  redirect_uri: string;
  response_type: string;
  state: string;
  scope: string[];
  show_dialog: string;
  code_challenge_method: string;
  code_challenge: string;
}

const init = (redirect_url: any): MessageResponse => {
  if (redirect_url) {
    if (chrome.runtime.lastError) {
      return { content: '123' };
    } else {
      //parse this in a better way
      if (redirect_url.includes('callback?error=access_denied')) {
        return { content: '456' };
      } else {
        authData.code = redirect_url.substring(
          redirect_url.indexOf('code=') + 5,
          redirect_url.indexOf('state=') - 1
        );
        const state = redirect_url.substring(
          redirect_url.indexOf('state=') + 6
        );
        return { content: state };
      }
    }
  } else {
    console.log('Redirect failed!');
  }
  return { content: '' };
};

const getToken = () => {
  const tokenData: TokenRequestParams = {
    client_id: authData.client_id,
    grant_type: GRANT_TYPE,
    code: authData.code,
    redirect_uri: REDIRECT_URI,
    code_verifier: authData.codeVerifier,
  };

  const formData = buildParams(tokenData);
  console.log(formData.toString());

  postData(API_TOKEN_ENDPOINT, formData, true).then((res) => {
    if (res.status === 200) {
      res.json().then((data) => {
        return { content: data.access_token };
      });
    } else {
      res.json().then((data) => {
        console.log(data);
      });
    }
  });
};
const getPkceAuthUrl = (): string => {
  const data: AuthRequestParams = {
    client_id: authData.client_id,
    response_type: RESPONSE_TYPE,
    redirect_uri: REDIRECT_URI,
    state: authData.state,
    scope: [PLAYLIST_PUBLIC_SCOPE, PLAYLIST_PRIVATE_SCOPE],
    show_dialog: SHOW_DIALOG,
    code_challenge_method: authData.codeChallengeMethod,
    code_challenge: authData.codeChallenge,
  };

  const searchParams = buildParams(data);

  const url = AUTH_URL.concat(searchParams.toString());

  console.log(url);

  return url;
};

const getSong = () => {}; //if no token, get token
const addToPlaylist = () => {};

export { getToken, getSong, addToPlaylist, init, getPkceAuthUrl as getPkceUrl };

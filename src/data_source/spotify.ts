import { MessageResponse } from '../types';
import { postData, RequestParams, buildParams, getData } from '../apiUtils';
import { authData } from 'src/chrome/auth';
import { resourceLimits } from 'worker_threads';
import { rejects } from 'assert';

const RESPONSE_TYPE = 'code';
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI || '';
const PLAYLIST_PRIVATE_SCOPE = 'playlist-modify-private';
const PLAYLIST_PUBLIC_SCOPE = 'playlist-modify-public';
const SHOW_DIALOG = 'true';
const GRANT_TYPE = 'authorization_code';
const BASE_ADDRESS = 'https://api.spotify.com/v1/search?';
const AUTH_URL = 'https://accounts.spotify.com/authorize?';
const API_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const PLAYLIST_ID = process.env.REACT_APP_PLAYLIST_ID;

interface TokenRequestParams extends RequestParams {
  client_id: string;
  grant_type: string;
  code: string;
  redirect_uri: string;
  code_verifier: string;
}
interface AuthRequestParams extends RequestParams {
  client_id: string;
  redirect_uri: string;
  response_type: string;
  state: string;
  scope: string[];
  show_dialog: string;
  code_challenge_method: string;
  code_challenge: string;
}

interface SearchParams extends RequestParams {
  type: string;
  q: string;
  limit: number;
}

interface TrackInfo {
  artist: string;
  song: string;
}

const handleRedirect = (redirect_url: any): MessageResponse => {
  const response: MessageResponse = {
    content: '',
    success: false,
  };
  if (redirect_url) {
    if (chrome.runtime.lastError) {
      return response;
    } else {
      //parse this in a better way
      if (redirect_url.includes('callback?error=access_denied')) {
        return response;
      } else {
        authData.code = redirect_url.substring(
          redirect_url.indexOf('code=') + 5,
          redirect_url.indexOf('state=') - 1
        );
        const state = redirect_url.substring(
          redirect_url.indexOf('state=') + 6
        );
        return { ...response, content: state, success: true };
      }
    }
  } else {
    return response;
  }
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

  return postData(API_TOKEN_ENDPOINT, formData, true).then((res) => {
    const response: MessageResponse = {
      content: '',
      success: false,
    };
    return res.json().then((data) => {
      console.log(data);
      return data;
    });
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

/**
 *
 * @param TrackInfo - song name and artist name
 * @returns spotify track uri
 */
//https://developer.spotify.com/documentation/web-api/reference/#category-search
const getSong = ({ song, artist }: TrackInfo) => {
  const query = `track:${song} artist:${artist}}`;
  const data: SearchParams = {
    type: 'track',
    limit: 1,
    q: query,
  };
  const searchParams = buildParams(data);

  const url = BASE_ADDRESS.concat(searchParams.toString());
  return getData(url, authData.token).then((res) => {
    return res.json().then((data) => {
      console.log(res.status);
      if (res.status === 200) {
        console.log('successful');
        return { content: data.tracks.items[0].uri, success: true };
      }
      return { success: false, content: data };
    });
  });
  //if found song -> add it, if not, display error message in place (create a toast)
};

//https://developer.spotify.com/documentation/web-api/reference/#/operations/add-tracks-to-playlist
const addToPlaylist = (uri: string) => {
  const url = `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks`;
  const data = {
    uris: [uri],
  };
  return postData(
    url,
    JSON.stringify(data),
    false,
    `Bearer ${authData.token}`
  ).then((res) => {
    return res.json().then(() => {
      console.log(res.status);
      if (res.status === 201) {
        return { success: true, content: 'footastic!' };
      }
      return { content: res, success: false };
    });
  });
};

export {
  getToken,
  getSong,
  addToPlaylist,
  handleRedirect,
  getPkceAuthUrl as getPkceUrl,
};

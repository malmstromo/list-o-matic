import { challenge, randomStringVerifier } from '../cryptoUtils';

const CLIENT_ID = '0efe050f6fe046ccb90f4b8464c1edb1';
const RESPONSE_TYPE = 'code';
const REDIRECT_URI =
  'https://coddndlacciekokgjfeeoiphmhgknhpj.chromiumapp.org/';
const PLAYLIST_PRIVATE_SCOPE = 'playlist-modify-private';
const PLAYLIST_PUBLIC_SCOPE = 'playlist-modify-public';
const SHOW_DIALOG = 'true';
const CODE_CHALLENGE_METHOD = 'S256';
const GRANT_TYPE = 'authorization_code';
const ACCESS_TOKEN = '';
const CODE = '';
const BASE_ADDRESS = 'https://api.spotify.com/v1/search';
const API_TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const SEARCH_QUERY = 'q';
const SEARCH_TYPE = 'type';
let song;

const STATE = 'meet' + Math.random().toString(36).substring(2, 15);
const VERIFIER = randomStringVerifier;

const authData = {
  state: STATE,
  codeChallengeMethod: CODE_CHALLENGE_METHOD,
  codeVerifier: VERIFIER,
  codeChallenge: '',
  client_id: CLIENT_ID,
  token: '',
  code: '',
};

export { authData };

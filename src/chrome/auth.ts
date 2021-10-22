import { randomStringVerifier } from '../cryptoUtils';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID || '';
const CODE_CHALLENGE_METHOD = 'S256';
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

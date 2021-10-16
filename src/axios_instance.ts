// import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

// const instance = axios.create({
//   // Let's array being serialized this way: 'a=b&a=c'

//   paramsSerializer: (params) => {
//     return qs.stringify(params, { arrayFormat: 'repeat' });
//   },
// });

// export function interceptRequest(request: AxiosRequestConfig) {
//   return addRequestId(verifyTokenValidity(request));
// }

// function addRequestId(request: AxiosRequestConfig) {
//   return {
//     ...request,
//     headers: { ...request.headers, [HttpHeader.X_REQUEST_ID]: uuidv4() },
//   };
// }

// /**

// * removes an expired personal-service JWT token from the storage engine, store, and request

// */

// function verifyTokenValidity(request: AxiosRequestConfig) {
//   const token = getJwtToken();

//   if (token) {
//     if (isTokenExpired(token)) {
//       store.dispatch(actionDeleteToken());

//       const persistedState = window.localStorage.getItem('persist:redux');

//       if (persistedState) {
//         const parsedState = JSON.parse(persistedState);

//         window.localStorage.setItem(
//           'persist:redux',

//           JSON.stringify({ ...parsedState, jwt_token: '' })
//         );
//       }

//       return {
//         ...request,

//         headers: { ...request.headers, [HttpHeader.X_AUTHORIZATION]: '' },
//       };
//     }
//   }

//   return request;
// }

// /**

// * Intercept success response

// *

// * If user's session expires, WebSEAL returns a login page instead of response

// * for the REST request. The interceptor reloads the page in this case in order

// * to rerun the process and render the login page.

// *

// * @param response

// */

// export function interceptResponse(response: AxiosResponse) {
//   if (
//     `${response.data}`.includes('<meta data-name="trafi" content="loginpage">')
//   ) {
//     window.location.reload();
//   }

//   return response;
// }

// /**

// * Error interceptor dispatches the errors to  be handled by Redux

// *

// * @param error

// */

// export function interceptError(error: AxiosError) {
//   if (axios.isCancel(error)) {
//     return;
//   } else if (error.response && error.response.status) {
//     store.dispatch(actionAddServerError(error));
//   } else {
//     store.dispatch(actionAddConnectionError(error));
//   }

//   return Promise.reject(error);
// }

// // Register interceptors to Axios instance

// instance.interceptors.response.use(interceptResponse, interceptError);

// instance.interceptors.request.use(interceptRequest);

// export default instance;

export {};

export interface RequestParams {
  client_id: string;
}
// Example POST method implementation:
async function postData(
  url = '',
  data: any,
  formEncoded?: boolean,
  auth?: string
) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: auth ? 'include' : 'omit',
    headers: {
      'Content-Type': formEncoded
        ? 'application/x-www-form-urlencoded'
        : 'application/json',
      Authorization: auth || '',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: data, // body data type must match "Content-Type" header
  });
  return response; // parses JSON response into native JavaScript objects
}

async function getData(url: string, token?: string) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: token ? 'include' : 'omit',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  return response;
  // return response.json(); // parses JSON response into native JavaScript objects
}

const buildParams = (data: RequestParams) => {
  const params = new URLSearchParams();

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      params.append(key, value.join(','));
    } else {
      params.append(key, value.toString());
    }
  });

  return params;
};

export { postData, getData, buildParams };

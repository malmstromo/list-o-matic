import axios from 'axios';

const instance = axios.create();

// Register interceptors to Axios instance

instance.interceptors.response.use(
  (response) => {
    Promise.resolve({ ...response, foo: 'baz' });
  },
  (error) => {
    const foo = {
      ok: false,
      message: error.message,
      status: error.status,
      foo: 'bar',
    };
    return Promise.reject(foo);
  }
);

export default instance;

export {};

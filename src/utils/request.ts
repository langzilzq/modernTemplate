import axios, { AxiosRequestConfig } from 'axios';

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000,
  baseURL: '/web'
});

export function request(opts: AxiosRequestConfig) {
  return new Promise(resolve => {
    const reqFn = async () => {
      try {
        const res = await instance(opts);
        if (res.status === 200) {
          return resolve(res.data);
        }
        return resolve({});
      } catch (error) {
        // Message.error({
        //   id: 'baseReq',
        //   content: msg
        // });
        return resolve({});
      }
    };
    reqFn();
  });
}

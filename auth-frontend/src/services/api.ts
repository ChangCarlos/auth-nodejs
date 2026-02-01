import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3001',
  withCredentials: true,
});


let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { data } = await api.post("/refresh");

          api.defaults.headers.common["Authorization"] =
            `Bearer ${data.accessToken}`;

          processQueue(null, data.accessToken);
        } catch (err) {
          processQueue(err, null);
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }
    return Promise.reject(error);
  },
);

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'https://kinetix-ima-backend.onrender.com';
const TOKEN_KEY = 'ima_auth_token';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      Cookies.remove(TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, { expires: 1, secure: true, sameSite: 'strict' });
};

export const removeAuthToken = (): void => {
  Cookies.remove(TOKEN_KEY);
};

export const getAuthToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export { API_BASE_URL, TOKEN_KEY };

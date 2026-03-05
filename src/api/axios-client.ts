import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

export const BASEURL =
  import.meta.env.VITE_API_URL ?? "https://demo.acmetech.com.np/";

const getToken = () => localStorage.getItem("token");

export const publicApi = axios.create({
  baseURL: BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const createAxiosInstance = (contentType: string) => {
  const instance = axios.create({
    baseURL: BASEURL,
    headers: {
      "Content-Type": contentType,
      "x-project-type": "acmestore",
    },
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken();
      if (token) {
        config.headers["X-Api-Key"] =  `${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const status = error.response?.status;
      if (status === 401) {
        localStorage.removeItem("token");
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

export const api = createAxiosInstance("application/json");
export const fileApi = createAxiosInstance("multipart/form-data");

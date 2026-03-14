import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

export const ApiStatusCode = {
  Success: 200,
  Created: 201,
  NoContent: 204,
  Ambiguous: 300,
  BadRequest: 400,
  UnAuthorized: 401,
  Forbidden: 403,
  TokenExpired: 419,
  NotFound: 404,
  Conflict: 409,
  InternalServerError: 500,
  ServiceUnavailable: 503,
} as const;

export type ApiStatusCode = (typeof ApiStatusCode)[keyof typeof ApiStatusCode];

interface ApiResponse<T = unknown> {
  status: ApiStatusCode;
  message?: string;
  data?: T;
}

export const BASEURL =
  import.meta.env.VITE_API_URL ?? "https://demo.acmetech.com.np/";

export const getToken = () => localStorage.getItem("token");

// export const publicApi = axios.create({
//   baseURL: BASEURL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
// publicApi.interceptors.response.use(
//   (response) => {
//     const responseData = response.data as ApiResponse;
//     const appStatus = responseData?.status;

//     if (
//       appStatus === ApiStatusCode.UnAuthorized ||
//       appStatus === ApiStatusCode.TokenExpired
//     ) {
//       localStorage.removeItem("token");

//       toast.error("Action Failed", {
//         description: responseData.message || `Error code: ${appStatus}`,
//         duration: 3000,
//       });

//       if (window.location.pathname !== "/") {
//         window.location.href = "/";
//       }

//       return Promise.reject(responseData);
//     }
//     const isSuccess = appStatus >= 200 && appStatus < 300;

//     if (!isSuccess) {
//       toast.error("Action Failed", {
//         description: responseData.message || `Error code: ${appStatus}`,
//         duration: 4000,
//       });

//       return Promise.reject(responseData);
//     }

//     return response;
//   },
//   (error: AxiosError<ApiResponse>) => {
//     const networkMessage = error.response?.data?.message || error.message;

//     toast.error("Network Error", {
//       description: networkMessage,
//     });

//     return Promise.reject(error);
//   },
// );

const createAxiosInstance = (contentType: string) => {
  const instance = axios.create({
    baseURL: BASEURL,
    headers: {
      "Content-Type": contentType,
      "x-project-type": "acmestore",
    },
    paramsSerializer: {
      serialize: (params) => {
        return Object.entries(params)
          .map(([key, value]) => {
            if (value === undefined || value === null) return "";
            return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
          })
          .filter(Boolean)
          .join("&");
      },
    },
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken();
      if (token) {
        config.headers["X-Api-Key"] = `${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => {
      const responseData = response.data as ApiResponse;
      const appStatus = responseData?.status;

      if (
        appStatus === ApiStatusCode.UnAuthorized ||
        appStatus === ApiStatusCode.TokenExpired
      ) {
        localStorage.removeItem("token");
        toast.error("Action Failed", {
          description: responseData.message || `Error code: ${appStatus}`,
          duration: 3000,
        });
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
        return Promise.reject(responseData);
      }

      const isSuccess = appStatus >= 200 && appStatus < 300;

      if (!isSuccess) {
        toast.error("Action Failed", {
          description: responseData.message || `Error code: ${appStatus}`,
          duration: 3000,
        });
        return Promise.reject(responseData);
      }

      return response;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    },
  );

  return instance;
};

export const api = createAxiosInstance("application/json");
export const fileApi = createAxiosInstance("multipart/form-data");

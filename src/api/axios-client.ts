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

// Helper to handle logout/cleanup to avoid repeating code
const handleUnauthorized = (message?: string) => {
  localStorage.removeItem("token");
  toast.error("Session Expired", {
    description: message || "Please login again.",
    duration: 3000,
  });
  if (window.location.pathname !== "/") {
    window.location.href = "/";
  }
};

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
        handleUnauthorized(responseData.message);
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
      // --- NEW: Handle direct HTTP errors (404, 500, 503, etc.) ---
      const status = error.response?.status;
      const responseData = error.response?.data as ApiResponse;
      const errorMessage = responseData?.message || error.message || "An unexpected error occurred";

      if (status === ApiStatusCode.UnAuthorized || status === ApiStatusCode.TokenExpired) {
        handleUnauthorized(errorMessage);
      } else {
        toast.error("Server Error", {
          description: `[${status || "Network"}] ${errorMessage}`,
          duration: 4000,
        });
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

export const api = createAxiosInstance("application/json");
export const fileApi = createAxiosInstance("multipart/form-data");
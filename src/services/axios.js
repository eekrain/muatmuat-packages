import xior from "xior";

import { useAuthStore } from "@/store/auth/authStore";

export const createAxios = (baseURL) => {
  const fetcher = xior.create({
    baseURL,
    timeout: 30000, // 30 seconds timeout
  });

  // Request interceptor
  fetcher.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState();
      config.headers.Authorization = `Bearer ${token?.accessToken}`;
      config.headers.refreshToken = token?.refreshToken;
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  fetcher.interceptors.response.use(
    (response) => response,
    (error) => {
      // This function will be called for any status codes that fall outside the range of 2xx
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx.
        // This is where you'd typically handle 503 if the server sent a proper 503 response.
        if (error.response.status === 503) {
          console.warn(
            "Service Unavailable (503). Redirecting to maintenance page."
          );
          // Redirect the user to /maintenance
          window.location.replace(
            `${process.env.NEXT_PUBLIC_INTERNAL_WEB}sistem`
          );
          return new Promise(() => {}); // Prevent further promise resolution
        }
        // Handle other HTTP error codes (4xx, 5xx other than 503)
        if (error.response.status === 401 || error.response.status === 403) {
          useAuthStore.getState().logout();
          useUserStore.getState().removeUser();
          if (window) {
            window.location.replace(
              `${process.env.NEXT_PUBLIC_INTERNAL_WEB}login`
            );
          }
          return new Promise(() => {}); // Prevent further error propagation.
        }
        return Promise.reject(error);
      } else if (error.request) {
        // No response received (e.g., network error, server completely down).
        console.error("Network Error. No response from server.");
        // Redirect to maintenance page because server is effectively unavailable.
        window.location.replace(
          `${process.env.NEXT_PUBLIC_INTERNAL_WEB}sistem`
        );
        return new Promise(() => {}); // Prevent further error propagation.
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Request setup error:", error.message);
      }

      // Always re-throw the error so it can be caught by individual API calls
      // unless you've explicitly handled it (like redirecting and preventing further resolution).
      return Promise.reject(error);
    }
  );

  return fetcher;
};

const axios = createAxios(process.env.NEXT_PUBLIC_INTERNAL_API);
export default axios;

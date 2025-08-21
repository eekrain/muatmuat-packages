/* eslint-disable no-console */
import xior from "xior";

import { useTokenStore } from "@/store/AuthStore/tokenStore";
import { useUserStore } from "@/store/AuthStore/userStore";

const LIST_PUBLIC_ROUTES = [
  {
    path: "/sewaarmada",
    method: "exact",
  },
  {
    path: "/example",
    method: "startsWith",
  },
  {
    path: "/otp",
    method: "exact",
  },
  {
    path: "/login",
    method: "exact",
  },
  {
    path: "/ubah-password",
    method: "exact",
  },
  {
    path: "/lupa-password",
    method: "exact",
  },
  {
    path: "/dev-login",
    method: "exact",
  },
  {
    path: "/rdp-login",
    method: "exact",
  },
  {
    path: "/set-password",
    method: "exact",
  },
  {
    // /orders/orderId/drivers/driverId/qr-code
    path: /^\/orders\/[^\/]+\/drivers\/[^\/]+\/qr-code$/,
    method: "regex",
  },
  {
    path: "/agenda-armada-driver",
    method: "exact",
  },
];

export const createAxios = (baseURL) => {
  const fetcher = xior.create({
    baseURL,
    timeout: 30000, // 30 seconds timeout
  });

  // Request interceptor
  fetcher.interceptors.request.use(
    (config) => {
      const token = useTokenStore.getState();
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
        }
        // Handle other HTTP error codes (4xx, 5xx other than 503)
        if (error.response.status === 401 || error.response.status === 403) {
          useTokenStore.getState().actions.clearToken();
          useUserStore.getState().actions.clearUser();
          // If the user is not on the public routes, redirect to /sewaarmada
          const isPublicRoutes = LIST_PUBLIC_ROUTES.some((route) => {
            const pathname = window?.location?.pathname;
            if (!pathname) return false;

            switch (route.method) {
              case "exact":
                return pathname === route.path;
              case "startsWith":
                return pathname.startsWith(route.path);
              case "regex":
                return (
                  route.path instanceof RegExp && route.path.test(pathname)
                );
              default:
                return false;
            }
          });
          if (window?.location && !isPublicRoutes) {
            window.location.replace("/");
          }
        }
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

// For compatibility with existing code
// const axios = createAxios(process.env.NEXT_PUBLIC_INTERNAL_API);
// export default axios;

// API's with different target baseURL
export const fetcherMuatparts = createAxios(
  process.env.NEXT_PUBLIC_INTERNAL_API
);
export const fetcherMuatrans = createAxios(
  process.env.NEXT_PUBLIC_MUATRANS_API
);
export const fetcherPayment = createAxios(process.env.NEXT_PUBLIC_PAYMENT_API);
export const fetcherMock = createAxios();

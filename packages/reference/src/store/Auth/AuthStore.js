import { produce } from "immer";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  LOGIN_TRANSPORTER_ENDPOINT,
  loginTransporter,
} from "@/services/Transporter/auth/login";

import { zustandDevtools } from "@/lib/utils";

const initialState = {
  token: null,
  refreshToken: null,
  expiryTime: null,
  user: null,
  transporter: null,
  isAuthenticated: false,
};

export const useAuthStore = create(
  zustandDevtools(
    persist(
      (set) => ({
        ...initialState,
        login: async (payload) => {
          console.log(
            "[[DEBUG]] Trying to login from AuthStore.js version 2.0"
          );
          try {
            const apiPayload = {
              loginId: payload.identifier,
              password: payload.password,
              rememberMe: payload.rememberMe,
            };

            const response = await loginTransporter(
              LOGIN_TRANSPORTER_ENDPOINT,
              {
                arg: apiPayload,
              }
            );
            const data = response.data.Data;

            set(
              produce((state) => {
                state.token = data.token;
                state.refreshToken = data.refreshToken;
                state.expiryTime = data.expiryTime;
                state.user = data.user;
                state.transporter = data.transporter;
                state.isAuthenticated = true;
              })
            );

            return data;
          } catch (error) {
            console.error("Login failed:", error);
            throw error;
          }
        },
        logout: () => {
          set(initialState);
        },
      }),
      {
        name: "auth-storage",
        storage: createJSONStorage(() => localStorage),
      }
    ),
    {
      name: "auth-store",
    }
  )
);

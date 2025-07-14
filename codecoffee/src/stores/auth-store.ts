import { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  checkAuthStatus: () => boolean;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            },
          );

          if (!response.ok) {
            throw new Error("Login failed");
          }

          const data = await response.json();
          const { user, accessToken, refreshToken } = data;

          // Store tokens in localStorage
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        set({
          isAuthenticated: true,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      getAccessToken: () => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("accessToken");
      },

      getRefreshToken: () => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("refreshToken");
      },

      checkAuthStatus: () => {
        if (typeof window === "undefined") return false;

        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const isAuth = !!(accessToken && refreshToken);

        set({ isAuthenticated: isAuth });
        return isAuth;
      },

      initializeAuth: () => {
        if (typeof window === "undefined") {
          set({ isInitialized: true });
          return;
        }

        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const isAuth = !!(accessToken && refreshToken);

        set({
          isAuthenticated: isAuth,
          isInitialized: true,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initializeAuth();
        }
      },
    },
  ),
);

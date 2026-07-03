import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
  authUser: null,
  isLoggingIn: false,
  isRegistering: false,
  isCheckingAuth: true,

checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });

      const token = localStorage.getItem("token");
      if (!token) {
        set({ authUser: null });
        return;
      }

      const res = await axiosInstance.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ authUser: res.data.user });
    } catch (error) {
      localStorage.removeItem("token");
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (credentials) => {
    try {
      set({ isLoggingIn: true });

      const res = await axiosInstance.post("/auth/login", credentials);

      localStorage.setItem("token", res.data.token);

      set({ authUser: res.data.user });
      return true;
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  register: async (formData) => {
    try {
      set({ isRegistering: true });

      const res = await axiosInstance.post("/auth/register", formData);

      localStorage.setItem("token", res.data.token);

      set({ authUser: res.data.user });
      return true;
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
      return false;
    } finally {
      set({ isRegistering: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ authUser: null });
  },
}));

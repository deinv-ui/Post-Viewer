import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

export const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    return Date.now() < exp * 1000; // true if not expired
  } catch {
    return false;
  }
};

const useAuthStore = create((set) => ({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  token: localStorage.getItem("token") || "",
  user: null,

  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  resetForm: () =>
    set({ name: "", email: "", password: "", confirmPassword: "" }),
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem("token");
    set({ token: "", name: "", email: "", password: "", confirmPassword: "" });
  },
}));

export default useAuthStore;

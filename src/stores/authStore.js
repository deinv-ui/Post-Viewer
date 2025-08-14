import { create } from "zustand";

const useAuthStore = create((set) => ({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  token: localStorage.getItem("token") || "",

  setName: (name) => set({ name }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  resetForm: () => set({ name: "", email: "", password: "", confirmPassword: "" }),
  logout: () => {
    localStorage.removeItem("token");
    set({ token: "", name: "", email: "", password: "", confirmPassword: "" });
  },
}));

export default useAuthStore;

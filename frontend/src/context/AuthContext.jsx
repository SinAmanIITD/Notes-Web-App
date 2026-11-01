import { createContext, useContext, useState } from "react";
import * as authApi from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(authApi.isAuthenticated());

  const login = async (username, password) => {
    await authApi.login(username, password);
    setAuthed(true);
  };

  const register = async (username, email, password) => {
    await authApi.register(username, email, password);
    await authApi.login(username, password);
    setAuthed(true);
  };

  const logout = () => {
    authApi.logout();
    setAuthed(false);
  };

  return (
    <AuthContext.Provider value={{ authed, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

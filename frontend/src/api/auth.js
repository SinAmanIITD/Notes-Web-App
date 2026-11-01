import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export async function register(username, email, password) {
  const { data } = await axios.post(`${BASE_URL}/auth/register/`, { username, email, password });
  return data;
}

export async function login(username, password) {
  const { data } = await axios.post(`${BASE_URL}/auth/token/`, { username, password });
  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);
  return data;
}

export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem("access"));
}

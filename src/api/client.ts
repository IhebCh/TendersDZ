import axios from "axios";

const baseURL =
  (import.meta as any).env.VITE_API_BASE_URL || "http://localhost:8000";

let authToken: string | null = localStorage.getItem("auth_token");

export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem("auth_token", token);
  } else {
    localStorage.removeItem("auth_token");
  }
}

export function getAuthToken() {
  return authToken;
}

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${authToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export async function get<T>(url: string) {
  const res = await apiClient.get<T>(url);
  return res.data;
}

export async function post<T>(url: string, data: unknown) {
  const res = await apiClient.post<T>(url, data);
  return res.data;
}

export async function put<T>(url: string, data: unknown) {
  const res = await apiClient.put<T>(url, data);
  return res.data;
}

export async function del<T>(url: string) {
  const res = await apiClient.delete<T>(url);
  return res.data;
}

interface LoginResponse {
  access_token: string;
  token_type?: string;
  [key: string]: any;
}

export async function loginApi(username: string, password: string) {
  const data = new URLSearchParams();
  data.append("username", username);
  data.append("password", password);
  // Optional extras if you ever need them:
  // data.append("scope", "");
  // data.append("grant_type", "");

  const res = await apiClient.post<LoginResponse>("/auth/login", data, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  if (res.data?.access_token) {
    setAuthToken(res.data.access_token);
  }
  return res.data;
}

export function logout() {
  setAuthToken(null);
}

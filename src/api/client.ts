import axios from "axios";

const baseURL =
  (import.meta as any).env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

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

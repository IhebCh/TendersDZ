import axios from "axios";
import type {
  AuthTokenResponse,
  Client,
  Supplier,
  Tender,
  TenderItem
} from "../types";

export const baseURL =
  (import.meta as any).env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL
});

// Attach Authorization header when token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tendersdz_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export async function loginApi(
  username: string,
  password: string
): Promise<AuthTokenResponse> {
  const body = new URLSearchParams();
  body.append("username", username);
  body.append("password", password);

  const { data } = await api.post<AuthTokenResponse>("/auth/login", body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
  return data;
}

// ---- Clients ----
export async function fetchClients(): Promise<Client[]> {
  const { data } = await api.get<Client[]>("/clients/");
  return data;
}

export async function createClient(payload: Omit<Client, "id">): Promise<Client> {
  const { data } = await api.post<Client>("/clients/", payload);
  return data;
}

export async function updateClient(
  id: number,
  payload: Partial<Omit<Client, "id">>
): Promise<Client> {
  const { data } = await api.put<Client>(`/clients/${id}`, payload);
  return data;
}

export async function deleteClient(id: number): Promise<void> {
  await api.delete(`/clients/${id}`);
}

// ---- Suppliers ----
export async function fetchSuppliers(): Promise<Supplier[]> {
  const { data } = await api.get<Supplier[]>("/suppliers/");
  return data;
}

export async function createSupplier(
  payload: Omit<Supplier, "id">
): Promise<Supplier> {
  const { data } = await api.post<Supplier>("/suppliers/", payload);
  return data;
}

export async function updateSupplier(
  id: number,
  payload: Partial<Omit<Supplier, "id">>
): Promise<Supplier> {
  const { data } = await api.put<Supplier>(`/suppliers/${id}`, payload);
  return data;
}

export async function deleteSupplier(id: number): Promise<void> {
  await api.delete(`/suppliers/${id}`);
}

// ---- Tenders ----
export async function fetchTenders(): Promise<Tender[]> {
  const { data } = await api.get<Tender[]>("/tenders/");
  return data;
}

export async function fetchTender(id: number): Promise<Tender> {
  const { data } = await api.get<Tender>(`/tenders/${id}`);
  return data;
}

export async function createTender(
  payload: Omit<Tender, "id">
): Promise<Tender> {
  const { data } = await api.post<Tender>("/tenders/", payload);
  return data;
}

export async function updateTender(
  id: number,
  payload: Partial<Omit<Tender, "id">>
): Promise<Tender> {
  const { data } = await api.put<Tender>(`/tenders/${id}`, payload);
  return data;
}

export async function deleteTender(id: number): Promise<void> {
  await api.delete(`/tenders/${id}`);
}

// ---- Tender Items ----
export async function fetchTenderItems(
  tenderId?: number
): Promise<TenderItem[]> {
  // If your backend supports filtering by ?tender_id= you can enable it here.
  const { data } = await api.get<TenderItem[]>(
    tenderId ? `/tender_items/?tender_id=${tenderId}` : "/tender_items/"
  );
  return data;
}

export async function createTenderItem(
  payload: Omit<TenderItem, "id">
): Promise<TenderItem> {
  const { data } = await api.post<TenderItem>("/tender_items/", payload);
  return data;
}

export async function updateTenderItem(
  id: number,
  payload: Partial<Omit<TenderItem, "id">>
): Promise<TenderItem> {
  const { data } = await api.put<TenderItem>(`/tender_items/${id}`, payload);
  return data;
}

export async function deleteTenderItem(id: number): Promise<void> {
  await api.delete(`/tender_items/${id}`);
}

export type TenderStatus = "draft" | "in_study" | "go" | "submitted" | "won" | "lost";

// src/types/index.ts

// ---- Clients ----
export interface Client {
  id: number;
  reference: string;
  title: string;
  client_name?: string;
  status?: TenderStatus;
  submission_deadline?: string; // ISO string
  created_at?: string;
}

export interface Supplier {
  id: number;
  name: string;
  country?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
}

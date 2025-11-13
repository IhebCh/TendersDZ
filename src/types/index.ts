export type TenderStatus = "draft" | "in_study" | "go" | "submitted" | "won" | "lost";

// src/types/index.ts

// ---- Clients ----
export interface Client {
  id: number;
  name: string;
  contact?: string | null;
  country?: string | null;
  notes?: string | null;
}

// ---- Suppliers ----
// (aligned to your backend schema, even if not used yet)
export interface Supplier {
  id: number;
  name: string;
  contact?: string | null;
  country?: string | null;
  is_oem: boolean;
  verified: boolean;
}

// ---- Tenders ----
export interface Tender {
  id: number;
  client_id: number;
  title: string;
  reference_no?: string | null;
  currency: string; // "DZD", etc.
  status: string;   // e.g. "IDENTIFIED", "STUDYING", ...
  submission_deadline?: string | null; // ISO datetime
}

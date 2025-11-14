export interface Client {
  id: number;
  name: string;
  contact?: string | null;
  country?: string | null;
  notes?: string | null;
}

export interface Supplier {
  id: number;
  name: string;
  contact?: string | null;
  country?: string | null;
  is_oem: boolean;
  verified: boolean;
}

export type TenderStatus =
  | "IDENTIFIED"
  | "BOUGHT"
  | "STUDYING"
  | "SUBMITTED"
  | "WON"
  | "LOST"
  | string;

export interface Tender {
  id: number;
  client_id: number;
  title: string;
  reference_no?: string | null;
  currency: string;
  status: TenderStatus;
  submission_deadline?: string | null; // ISO string from backend
}

export type TenderCategory = "HW" | "SW" | "SPARE" | "SERVICE" | string;

export interface TenderItem {
  id: number;
  tender_id: number;
  category: TenderCategory;
  description: string;
  qty: number;
  uom: string;
  authenticity_required: boolean;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
}

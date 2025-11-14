import { Tag } from "antd";
import type { TenderStatus } from "../../types";

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  IDENTIFIED: { color: "default", label: "Identified" },
  BOUGHT: { color: "purple", label: "Bought" },
  STUDYING: { color: "orange", label: "Studying" },
  SUBMITTED: { color: "blue", label: "Submitted" },
  WON: { color: "green", label: "Won" },
  LOST: { color: "red", label: "Lost" }
};

interface StatusTagProps {
  status?: TenderStatus | null;
}

export function StatusTag({ status }: StatusTagProps) {
  // Normalize just in case backend sends lowercase or extra spaces
  const normalized = (status || "").toString().trim().toUpperCase();

  const meta =
    STATUS_CONFIG[normalized] || {
      color: "default",
      label: status ?? "UNKNOWN"
    };

  return <Tag color={meta.color}>{meta.label}</Tag>;
}

import { Tag } from "antd";
import type { TenderStatus } from "../../types";

const statusConfig: Record<
  TenderStatus,
  { color: string; label: string }
> = {
  draft: { color: "default", label: "Draft" },
  in_study: { color: "processing", label: "In study" },
  go: { color: "blue", label: "Go" },
  submitted: { color: "gold", label: "Submitted" },
  won: { color: "green", label: "Won" },
  lost: { color: "red", label: "Lost" }
};

export function StatusTag({ status }: { status?: TenderStatus }) {
  if (!status) return <Tag>Unknown</Tag>;
  const cfg = statusConfig[status];
  return <Tag color={cfg.color}>{cfg.label}</Tag>;
}

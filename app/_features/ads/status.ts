import type { AdStatus } from "../../types/database.types";

interface AdStatusDisplay {
  color: string;
  label: string;
}

const AD_STATUS_DISPLAY: Record<AdStatus, AdStatusDisplay> = {
  archived: { color: "gray", label: "بایگانی شده" },
  pending: { color: "yellow", label: "در حال بررسی" },
  published: { color: "green", label: "منتشر شده" },
  rejected: { color: "red", label: "رد شده" },
  sold: { color: "blue", label: "فروخته شده" },
};

export function getAdStatusDisplay(status: AdStatus): AdStatusDisplay {
  return AD_STATUS_DISPLAY[status];
}

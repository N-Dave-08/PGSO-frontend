import { DataRecord, DataValue } from "./export";
import { Request } from "@/types/requests";

export const requestExportHeaders = {
  control_no: "Control No.",
  request_title: "Title",
  description: "Description",
  category_name: "Category",
  status: "Status",
  date_requested: "Date Requested",
  date_completed: "Date Completed",
  "requested_by.full_name": "Requested By",
  "requested_by.department": "Department",
  "requested_by.division": "Division",
  personnel: "Personnel",
  team_lead: "Team Lead",
  feedback: "Feedback",
  rating: "Rating",
  file_url: "Request Photo URL",
  file_completion_url: "Completion Photo URL",
};

export const transformRequestForExport = (item: Request): DataRecord => ({
  control_no: item.control_no,
  request_title: item.request_title,
  description: item.description,
  category_name: item.category_name || "N/A",
  status: item.status,
  date_requested: item.date_requested,
  date_completed: item.date_completed,
  "requested_by.full_name":
    item.requested_by.full_name ||
    `${item.requested_by.first_name} ${item.requested_by.last_name}`,
  "requested_by.department": item.requested_by.department || "N/A",
  "requested_by.division": item.requested_by.division || "N/A",
  personnel: Array.isArray(item.personnel)
    ? item.personnel.map((p) => p.name).join("; ")
    : "N/A",
  team_lead: item.team_lead
    ? `${item.team_lead.first_name} ${item.team_lead.last_name}`
    : "N/A",
  feedback: item.feedback || "N/A",
  rating: item.rating || "N/A",
  file_url: item.file_url || "N/A",
  file_completion_url: item.file_completion_url || "N/A",
});

export type HeaderConfig = {
  label: string;
  key: string;
  format?: (value: DataValue) => string;
};

export type HeadersConfig = Record<string, HeaderConfig>;

export function formatValue(value: DataValue): string {
  if (value === null || value === undefined) {
    return "N/A";
  }

  if (typeof value === "object") {
    if (Array.isArray(value)) {
      return value.map((v) => formatValue(v)).join("; ");
    }
    return JSON.stringify(value);
  }

  return String(value);
}

export function convertHeadersToDisplayMap(
  config: HeadersConfig
): Record<string, string> {
  return Object.entries(config).reduce((acc, [key, { label }]) => {
    acc[key] = label;
    return acc;
  }, {} as Record<string, string>);
}

export function formatDataForExport(
  data: DataRecord[],
  config: HeadersConfig
): DataRecord[] {
  return data.map((item) => {
    const formattedItem: DataRecord = {};

    Object.entries(config).forEach(([key, { format }]) => {
      const value = item[key];
      formattedItem[key] = format ? format(value) : formatValue(value);
    });

    return formattedItem;
  });
}

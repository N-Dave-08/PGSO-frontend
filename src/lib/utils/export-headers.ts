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
  feedback: "Feedback",
  rating: "Rating",
  file_url: "Request Photo URL",
  file_completion_url: "Completion Photo URL",
};

export const transformRequestForExport = (item: any) => ({
  control_no: item.control_no,
  request_title: item.request_title,
  description: item.description,
  category_name: item.category_name,
  status: item.status,
  date_requested: item.date_requested,
  date_completed: item.date_completed,
  "requested_by.full_name":
    item.requested_by.full_name ||
    `${item.requested_by.first_name} ${item.requested_by.last_name}`,
  "requested_by.department": item.requested_by.department || "N/A",
  "requested_by.division": item.requested_by.division || "N/A",
  personnel: Array.isArray(item.personnel)
    ? item.personnel.map((p: any) => p.name).join("; ")
    : "N/A",
  feedback: item.feedback || "N/A",
  rating: item.rating || "N/A",
  file_url: item.file_url || "N/A",
  file_completion_url: item.file_completion_url || "N/A",
});

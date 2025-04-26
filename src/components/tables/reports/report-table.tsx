"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { DataTableExport } from "@/components/ui/data-table/data-table-export";
import { columns } from "./report-columns";
import { ReportRequest } from "@/types/reports";
import RequestDetailsModal from "@/components/modals/request-details";
import { Request } from "@/types";

interface ReportTableProps {
  data: ReportRequest[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  onPageChange: (page: number) => void;
  onSearch?: (value: string) => void;
}

const transformToRequest = (report: ReportRequest): Request => {
  return {
    ...report,
    personnel: report.personnel.map((p) => ({
      ...p,
      is_team_lead: Boolean(p.is_team_lead),
    })),
    requested_by: {
      ...report.requested_by,
      division_location: report.requested_by.division_location || "",
      office_location: report.requested_by.division_location || "",
    },
    category_id: report.category_id || null,
    category_name: report.category_name || null,
  };
};

export function ReportTable({
  data,
  pagination,
  onPageChange,
  onSearch,
}: ReportTableProps) {
  const exportHeaders = React.useMemo(
    () => ({
      control_no: "Control No.",
      request_title: "Title",
      description: "Description",
      category_name: "Category",
      status: "Status",
      date_requested: "Date Requested",
      date_completed: "Date Completed",
      "requested_by.first_name": "Requested By First Name",
      "requested_by.last_name": "Requested By Last Name",
      "requested_by.department": "Department",
      "requested_by.division": "Division",
      "requested_by.division_location": "Division Location",
      personnel: "Personnel",
      team_lead: "Team Lead",
      feedback: "Feedback",
      rating: "Rating",
      note: "Note",
      file_url: "Request Photo URL",
      file_completion_url: "Completion Photo URL",
    }),
    []
  );

  const exportData = React.useMemo(
    () =>
      data.map((item) => ({
        control_no: item.control_no,
        request_title: item.request_title,
        description: item.description,
        category_name: item.category_name,
        status: item.status,
        date_requested: item.date_requested,
        date_completed: item.date_completed,
        "requested_by.first_name": item.requested_by.first_name,
        "requested_by.last_name": item.requested_by.last_name,
        "requested_by.department": item.requested_by.department || "N/A",
        "requested_by.division": item.requested_by.division || "N/A",
        "requested_by.division_location":
          item.requested_by.division_location || "N/A",
        personnel: item.personnel
          .map((p) => `${p.name}${p.is_team_lead ? " (Team Lead)" : ""}`)
          .join("; "),
        team_lead: item.team_lead
          ? `${item.team_lead.first_name} ${item.team_lead.last_name}`
          : "N/A",
        feedback: item.feedback,
        rating: item.rating,
        note: item.note,
        file_url: item.file_url || "N/A",
        file_completion_url: item.file_completion_url || "N/A",
      })),
    [data]
  );

  const renderToolbar = React.useCallback(
    (table: Table<ReportRequest>) => (
      <DataTableToolbar table={table} onSearch={onSearch}>
        <DataTableExport
          data={exportData}
          headers={exportHeaders}
          filename="reports"
        />
      </DataTableToolbar>
    ),
    [onSearch, exportData, exportHeaders]
  );

  const renderPagination = React.useCallback(
    () => (
      <DataTablePagination
        currentPage={pagination.current_page}
        pageCount={pagination.last_page}
        perPage={pagination.per_page}
        total={pagination.total}
        tableName="report"
        onPageChange={onPageChange}
      />
    ),
    [pagination, onPageChange]
  );

  return (
    <DataTable
      data={data}
      columns={columns}
      renderToolbar={renderToolbar}
      renderPagination={renderPagination}
      rowContextMenu={(row, rowData) => (
        <RequestDetailsModal
          request={transformToRequest(rowData)}
          trigger={row}
        />
      )}
    />
  );
}

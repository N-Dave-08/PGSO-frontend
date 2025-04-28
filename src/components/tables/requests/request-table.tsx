"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { DataTableExport } from "@/components/ui/data-table/data-table-export";
import { columns } from "./request-columns";
import { Request } from "@/types";
import RequestDetailsModal from "@/components/modals/request-details";

interface RequestTableProps {
  data: Request[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  onPageChange: (page: number) => void;
  onSearch?: (searchTerm: string) => void;
}

export function RequestTable({
  data,
  pagination,
  onPageChange,
  onSearch,
}: RequestTableProps) {
  const exportHeaders = React.useMemo(
    () => ({
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
        "requested_by.full_name": item.requested_by.full_name,
        "requested_by.department": item.requested_by.department || "N/A",
        "requested_by.division": item.requested_by.division || "N/A",
        personnel: item.personnel
          .map((p) => `${p.name}${p.is_team_lead ? " (Team Lead)" : ""}`)
          .join("; "),
        team_lead: item.team_lead
          ? `${item.team_lead.first_name} ${item.team_lead.last_name}`
          : "N/A",
        feedback: item.feedback || "N/A",
        rating: item.rating || "N/A",
        note: item.note || "N/A",
        file_url: item.file_url || "N/A",
        file_completion_url: item.file_completion_url || "N/A",
      })),
    [data]
  );

  const renderToolbar = React.useCallback(
    (table: Table<Request>) => (
      <DataTableToolbar table={table} onSearch={onSearch}>
        <DataTableExport
          data={exportData}
          headers={exportHeaders}
          filename="requests"
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
        tableName="request"
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
        <RequestDetailsModal request={rowData} trigger={row} />
      )}
    />
  );
}

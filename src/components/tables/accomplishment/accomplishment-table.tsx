"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";

import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { DataTableExport } from "@/components/ui/data-table/data-table-export";
import { columns } from "./accomplishment-columns";
import { Accomplishment } from "@/types";
import { AccomplishmentViewModal } from "@/components/modals/accomplishment-view-modal";

interface AccomplishmentTableProps {
  data: Accomplishment[];
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  onPageChange?: (page: number) => void;
  onSearch?: (searchTerm: string) => void;
}

export function AccomplishmentTable({
  data,
  pagination,
  onPageChange,
  onSearch,
}: AccomplishmentTableProps) {
  const [selectedAccomplishment, setSelectedAccomplishment] =
    React.useState<Accomplishment | null>(null);

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
        "requested_by.department": item.requested_by.department,
        "requested_by.division": item.requested_by.division,
        personnel: item.personnel.map((p) => p.name).join("; "),
        team_lead: item.team_lead ? item.team_lead.full_name : "N/A",
        feedback: item.feedback || "N/A",
        rating: item.rating || "N/A",
        file_url: item.file_url || "N/A",
        file_completion_url: item.file_completion_url || "N/A",
      })),
    [data]
  );

  const renderToolbar = React.useCallback(
    (table: Table<Accomplishment>) => (
      <DataTableToolbar table={table} onSearch={onSearch}>
        <DataTableExport
          data={exportData}
          headers={exportHeaders}
          filename="accomplishments.csv"
        />
      </DataTableToolbar>
    ),
    [onSearch, exportData, exportHeaders]
  );

  const renderPagination = React.useCallback(
    () =>
      pagination && (
        <DataTablePagination
          currentPage={pagination.current_page}
          pageCount={pagination.last_page}
          perPage={pagination.per_page}
          total={pagination.total}
          tableName="accomplishment"
          onPageChange={(page) => onPageChange?.(page)}
        />
      ),
    [pagination, onPageChange]
  );

  const handleRowClick = React.useCallback((row: Accomplishment) => {
    setSelectedAccomplishment(row);
  }, []);

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        renderToolbar={renderToolbar}
        renderPagination={renderPagination}
        onRowClick={handleRowClick}
      />

      <AccomplishmentViewModal
        accomplishment={selectedAccomplishment}
        open={!!selectedAccomplishment}
        onOpenChange={(open) => !open && setSelectedAccomplishment(null)}
      />
    </>
  );
}

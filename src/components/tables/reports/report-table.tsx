"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
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
  const renderToolbar = React.useCallback(
    (table: Table<ReportRequest>) => (
      <DataTableToolbar table={table} onSearch={onSearch} />
    ),
    [onSearch]
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

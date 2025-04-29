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
import {
  requestExportHeaders,
  transformRequestForExport,
} from "@/lib/utils/export-headers";

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
      is_team_lead: false,
      email: p.email || "",
      team_lead_id: undefined,
    })),
    requested_by: {
      ...report.requested_by,
      first_name: report.requested_by.full_name.split(" ")[0],
      last_name: report.requested_by.full_name.split(" ").slice(1).join(" "),
      division_location: report.requested_by.division || "",
      office_location: report.requested_by.department || "",
    },
    team_lead: null,
    category_id: report.category_id || null,
    category_name: report.category_name || null,
    note: null,
  };
};

export function ReportTable({
  data,
  pagination,
  onPageChange,
  onSearch,
}: ReportTableProps) {
  const exportData = React.useMemo(
    () =>
      data.map((report) =>
        transformRequestForExport(transformToRequest(report))
      ),
    [data]
  );

  const renderToolbar = React.useCallback(
    (table: Table<ReportRequest>) => (
      <DataTableToolbar table={table} onSearch={onSearch}>
        <DataTableExport
          data={exportData}
          headers={requestExportHeaders}
          filename="reports"
        />
      </DataTableToolbar>
    ),
    [onSearch, exportData]
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

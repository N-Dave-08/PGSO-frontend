"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { DataTableExport } from "@/components/ui/data-table/data-table-export";
import { columns } from "./admin-report-columns";
import { AdminReportRequest } from "@/types/admin-reports";
import RequestDetailsModal from "@/components/modals/request-details";
import { Request } from "@/types";
import {
  requestExportHeaders,
  transformRequestForExport,
} from "@/lib/utils/export-headers";

interface AdminReportTableProps {
  data: AdminReportRequest[];
  pagination?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  onPageChange?: (page: number) => void;
  onSearch?: (value: string) => void;
}

const transformToRequest = (report: AdminReportRequest): Request => {
  const [firstName, ...lastNameParts] =
    report.requested_by.full_name.split(" ");

  return {
    ...report,
    personnel: report.personnel.map((p) => ({
      ...p,
      is_team_lead: false,
      email: p.email || "",
      team_lead_id: undefined,
    })),
    requested_by: {
      id: report.requested_by.id,
      first_name: firstName,
      last_name: lastNameParts.join(" "),
      division_location: report.requested_by.division,
      office_location: report.requested_by.department || "",
      department: report.requested_by.department || undefined,
      division: report.requested_by.division,
      full_name: report.requested_by.full_name,
    },
    team_lead: report.team_lead
      ? {
          id: report.team_lead.id,
          first_name: report.team_lead.full_name.split(" ")[0],
          last_name: report.team_lead.full_name.split(" ").slice(1).join(" "),
        }
      : null,
    category_id: report.category_id,
    category_name: report.category_name || "",
    note: null,
  };
};

export function AdminReportTable({
  data,
  pagination,
  onPageChange,
  onSearch,
}: AdminReportTableProps) {
  const exportData = React.useMemo(
    () =>
      data.map((report) =>
        transformRequestForExport(transformToRequest(report))
      ),
    [data]
  );

  const renderToolbar = React.useCallback(
    (table: Table<AdminReportRequest>) => (
      <DataTableToolbar table={table} onSearch={onSearch}>
        <DataTableExport
          data={exportData}
          headers={requestExportHeaders}
          filename="admin-reports"
        />
      </DataTableToolbar>
    ),
    [onSearch, exportData]
  );

  const renderPagination = React.useCallback(
    () =>
      pagination && onPageChange ? (
        <DataTablePagination
          currentPage={pagination.current_page}
          pageCount={pagination.last_page}
          perPage={pagination.per_page}
          total={pagination.total}
          tableName="admin-report"
          onPageChange={onPageChange}
        />
      ) : null,
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

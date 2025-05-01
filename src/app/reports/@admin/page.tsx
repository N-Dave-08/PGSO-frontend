"use client";

import { AdminReportTable } from "@/components/tables/admin-reports/admin-report-table";
import { AdminReportsService } from "@/lib/api/services/admin-reports-service";
import { AdminReportRequest } from "@/types/admin-reports";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { DataTableSkeleton } from "@/components/loaders/data-table-skeleton";
import { useCallback, useEffect, useState } from "react";
import { Pagination } from "@/types";

export default function Reports() {
  const [reports, setReports] = useState<AdminReportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const reportsService = new AdminReportsService();
      const response = await reportsService.getReports();
      if (response.isSuccess && response.data) {
        setReports(response.data);
        // If the API starts supporting pagination, update this part
        setPagination({
          total: response.data.length,
          per_page: 10,
          current_page: 1,
          last_page: Math.ceil(response.data.length / 10),
        });
      } else {
        setError("No reports data available");
        setReports([]);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      setError("Failed to fetch reports");
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      current_page: page,
    }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPagination((prev) => ({
      ...prev,
      current_page: 1,
    }));
  };

  if (loading) {
    return <DataTableSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Filter reports based on search term
  const filteredReports = reports.filter((report) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      report.control_no.toLowerCase().includes(searchLower) ||
      report.request_title.toLowerCase().includes(searchLower) ||
      report.category_name?.toLowerCase().includes(searchLower) ||
      report.status.toLowerCase().includes(searchLower) ||
      report.requested_by.full_name.toLowerCase().includes(searchLower)
    );
  });

  // Get paginated data
  const startIndex = (pagination.current_page - 1) * pagination.per_page;
  const endIndex = startIndex + pagination.per_page;
  const paginatedReports = filteredReports.slice(startIndex, endIndex);

  // Update pagination based on filtered results
  const totalPages = Math.ceil(filteredReports.length / pagination.per_page);
  const currentPagination = {
    ...pagination,
    total: filteredReports.length,
    last_page: totalPages,
  };

  return (
    <AdminReportTable
      data={paginatedReports}
      pagination={currentPagination}
      onPageChange={handlePageChange}
      onSearch={handleSearch}
    />
  );
}

"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { columns } from "./staff-columns";
import { Staff, Department } from "@/types/staffs";
import { StaffService } from "@/lib/api/services/staff-service";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { DataTableSkeleton } from "@/components/loaders/data-table-skeleton";
import CreateStaff from "@/components/modals/staff/create-staff";

export function StaffTable() {
  const [staff, setStaff] = React.useState<Staff[]>([]);
  const [department, setDepartment] = React.useState<Department | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");

  const fetchStaff = React.useCallback(async () => {
    try {
      setLoading(true);
      const staffService = new StaffService();
      const response = await staffService.getStaff();
      if (response.isSuccess) {
        setStaff(response.staff);
        setDepartment(response.department);
      }
      setError(null);
    } catch (error) {
      console.error("Error fetching staff:", error);
      setError("Failed to fetch staff");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Filter staff based on search term
  const filteredStaff = React.useMemo(() => {
    if (!searchTerm) return staff;
    const searchLower = searchTerm.toLowerCase();
    return staff.filter((member) => {
      return (
        member.first_name.toLowerCase().includes(searchLower) ||
        member.last_name.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower) ||
        member.division.division_name.toLowerCase().includes(searchLower)
      );
    });
  }, [staff, searchTerm]);

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

  const renderToolbar = (table: Table<Staff>) => (
    <div className="space-y-4">
      {department && (
        <div className="text-lg font-semibold">
          Department: {department.department_name}
        </div>
      )}
      <div className="flex items-center justify-between">
        <DataTableToolbar table={table} onSearch={handleSearch} />
        <CreateStaff onStaffCreated={fetchStaff} />
      </div>
    </div>
  );

  return (
    <DataTable
      data={filteredStaff}
      columns={columns}
      renderToolbar={renderToolbar}
    />
  );
}

"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { columns, RowContextMenu } from "./staff-columns";
import { Staff, Department, StaffResponse } from "@/types/staffs";
import { StaffService } from "@/lib/api/services/staff-service";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { DataTableSkeleton } from "@/components/loaders/data-table-skeleton";
import CreateStaff from "@/components/modals/staff/create-staff";
import EditStaff from "@/components/modals/staff/edit-staff";
import { toast } from "sonner";

interface StaffWithActions extends Staff {
  onDelete: () => Promise<void>;
  onEdit: () => void;
}

export function StaffTable() {
  const [staff, setStaff] = React.useState<Staff[]>([]);
  const [department, setDepartment] = React.useState<Department | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [editingStaff, setEditingStaff] = React.useState<Staff | null>(null);

  const fetchStaff = React.useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
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
      if (showLoading) setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchStaff(true);
  }, [fetchStaff]);

  const handleStaffCreated = React.useCallback(
    async (newStaffResponse: StaffResponse) => {
      if (newStaffResponse.isSuccess) {
        await fetchStaff(false);
      }
    },
    [fetchStaff]
  );

  const handleDelete = React.useCallback(
    async (staffId: number) => {
      try {
        const staffService = new StaffService();
        const response = await staffService.deleteStaff(staffId);
        if (response.isSuccess) {
          toast.success("Staff member deleted successfully");
          await fetchStaff(false);
        } else {
          toast.error(response.message || "Failed to delete staff member");
        }
      } catch (error) {
        console.error("Error deleting staff:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to delete staff member"
        );
      }
    },
    [fetchStaff]
  );

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

  const tableData = React.useMemo(
    () =>
      filteredStaff.map((staffMember) => ({
        ...staffMember,
        onDelete: () => handleDelete(staffMember.id),
        onEdit: () => setEditingStaff(staffMember),
      })),
    [filteredStaff, handleDelete]
  );

  const renderToolbar = React.useCallback(
    (table: Table<StaffWithActions>) => (
      <div className="space-y-4">
        {department && (
          <div className="text-lg font-semibold">
            Department: {department.department_name}
          </div>
        )}
        <div className="flex items-center justify-between">
          <DataTableToolbar table={table} onSearch={handleSearch} />
          <CreateStaff onStaffCreated={handleStaffCreated} />
        </div>
      </div>
    ),
    [department, handleStaffCreated]
  );

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

  return (
    <>
      <DataTable
        data={tableData}
        columns={columns}
        renderToolbar={renderToolbar}
        rowContextMenu={(row, data) => (
          <RowContextMenu
            row={row}
            staff={data}
            onDelete={data.onDelete}
            onEdit={data.onEdit}
          />
        )}
      />
      {editingStaff && (
        <EditStaff
          staff={editingStaff}
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingStaff(null);
          }}
          onStaffUpdated={async () => {
            await fetchStaff(false);
            setEditingStaff(null);
          }}
        />
      )}
    </>
  );
}

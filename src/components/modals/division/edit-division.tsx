"use client";

import { useState, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { updateDivision } from "@/lib/api/divisions";
import { Division } from "@/types";
import { getUsers, getAllUsers } from "@/lib/api/users";
import { User } from "@/types/users";
import { toast } from "sonner";
import { getDepartmentDropdown } from "@/lib/api/departments";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllDivisions } from "@/lib/api/divisions";

interface EditDivisionProps {
  division: Division;
  onDivisionUpdated: () => Promise<void>;
}

interface Department {
  id: number;
  department_name: string;
}

export default function EditDivision({
  division,
  onDivisionUpdated,
}: EditDivisionProps) {
  const [divisionName, setDivisionName] = useState<string>(
    division.division_name
  );
  const [officeLocation, setOfficeLocation] = useState<string>(
    division.office_location
  );
  const [departmentId, setDepartmentId] = useState<string>(
    division.department_id?.toString() || ""
  );
  const [staffMembers, setStaffMembers] = useState<User[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<number[]>(
    division.staff.map((staff) => staff.id)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingStaff(true);
      setLoadingDepartments(true);

      try {
        // Fetch departments
        const departmentData = await getDepartmentDropdown();
        setDepartments(departmentData.department || []);
        setLoadingDepartments(false);

        // Fetch all divisions to check assigned staff
        const divisionsResponse = await getAllDivisions();
        const allDivisions = divisionsResponse.divisions as Division[];

        // Get all staff IDs that are assigned to other divisions
        const assignedStaffIds = new Set<number>();
        allDivisions.forEach((div: Division) => {
          if (div.id !== division.id) {
            // Exclude current division
            div.staff.forEach((staff: { id: number }) => {
              assignedStaffIds.add(staff.id);
            });
          }
        });

        // Fetch users with staff role
        const usersResponse = await getAllUsers({ role_name: "staff" });
        // Filter out staff members who are already assigned to other divisions
        const availableStaff = usersResponse.user.filter(
          (staff) =>
            !assignedStaffIds.has(staff.id) ||
            division.staff.some((divStaff) => divStaff.id === staff.id)
        );

        setStaffMembers(availableStaff || []);
        setLoadingStaff(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load data");
      }
    };

    fetchData();
  }, [division.id, division.staff]);

  useEffect(() => {
    setDivisionName(division.division_name);
    setOfficeLocation(division.office_location);
    setDepartmentId(division.department_id?.toString() || "");
    setSelectedStaff(division.staff.map((staff) => staff.id));
  }, [division]);

  const filteredStaff = staffMembers.filter((staff) =>
    `${staff.first_name} ${staff.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleStaffToggle = (staffId: number) => {
    setSelectedStaff((prev) => {
      if (prev.includes(staffId)) {
        return prev.filter((id) => id !== staffId);
      } else {
        return [...prev, staffId];
      }
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const updateData = {
        division_name: divisionName,
        office_location: officeLocation,
        staff_id: selectedStaff,
        department_id: parseInt(departmentId, 10),
      };

      await updateDivision(division.id, updateData);
      toast.success("Division updated successfully");
      await onDivisionUpdated();
    } catch (err) {
      console.error("Division update error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update the Division"
      );
      toast.error(
        err instanceof Error ? err.message : "Failed to update the Division"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="divisionName">Division Name</Label>
        <Input
          id="divisionName"
          value={divisionName}
          onChange={(e) => setDivisionName(e.target.value)}
          placeholder="Enter division name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="officeLocation">Office Location</Label>
        <Input
          id="officeLocation"
          value={officeLocation}
          onChange={(e) => setOfficeLocation(e.target.value)}
          placeholder="Enter office location"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Select
          value={departmentId}
          onValueChange={setDepartmentId}
          required
          disabled={loadingDepartments}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a department" />
          </SelectTrigger>
          <SelectContent>
            {loadingDepartments ? (
              <SelectItem value="loading" disabled>
                <Loader2 className="mr-2 inline-block h-4 w-4 animate-spin" />
                Loading departments...
              </SelectItem>
            ) : departments.length === 0 ? (
              <SelectItem value="empty" disabled>
                No Departments Found
              </SelectItem>
            ) : (
              departments.map((department) => (
                <SelectItem
                  key={department.id}
                  value={department.id.toString()}
                >
                  {department.department_name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Staff Members</Label>
        <Input
          type="text"
          placeholder="Search staff..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {loadingStaff ? (
          <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading available staff...
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
            No available staff members available.
          </div>
        ) : (
          <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto rounded-md border p-2">
            {filteredStaff.map((staff) => (
              <div key={staff.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`staff-${staff.id}`}
                  checked={selectedStaff.includes(staff.id)}
                  onCheckedChange={() => handleStaffToggle(staff.id)}
                />
                <label
                  htmlFor={`staff-${staff.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {staff.first_name} {staff.last_name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Updating..." : "Update Division"}
        </Button>
      </div>
    </form>
  );
}

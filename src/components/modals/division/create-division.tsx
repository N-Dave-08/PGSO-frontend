"use client";

import { useState, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { createDivision } from "@/lib/api/divisions";
import { getAllUsers } from "@/lib/api/users";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { User } from "@/types/users";
import { getDepartmentDropdown } from "@/lib/api/departments";

interface CreateDivisionProps {
  onDivisionCreated: () => void;
}

interface Department {
  id: number;
  department_name: string;
}

export default function CreateDivision({
  onDivisionCreated,
}: CreateDivisionProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [divisionName, setDivisionName] = useState<string>("");
  const [officeLocation, setOfficeLocation] = useState<string>("");
  const [departmentId, setDepartmentId] = useState<string>("");
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentError, setDepartmentError] = useState<string | null>(null);
  const [staffMembers, setStaffMembers] = useState<User[]>([]);
  const [staffError, setStaffError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setDepartmentError(null);
        const departmentData = await getDepartmentDropdown();
        setDepartments(departmentData.department || []);
      } catch (err) {
        console.error("Error fetching departments:", err);
        setDepartmentError(
          err instanceof Error ? err.message : "Failed to load departments"
        );
      }

      try {
        setStaffError(null);
        const staffData = await getAllUsers({ role_name: "staff" });
        setStaffMembers(staffData.user || []);
      } catch (err) {
        console.error("Error fetching staff:", err);
        setStaffError(
          err instanceof Error ? err.message : "Failed to load staff members"
        );
      }
    };

    if (open) {
      fetchInitialData();
    }
    if (!open) {
      setDivisionName("");
      setOfficeLocation("");
      setDepartmentId("");
      setSelectedStaff([]);
      setError(null);
      setDepartmentError(null);
      setStaffError(null);
      setSearchQuery("");
    }
  }, [open]);

  const filteredStaff = staffMembers.filter((staff) =>
    `${staff.first_name} ${staff.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createDivision({
        division_name: divisionName,
        office_location: officeLocation,
        department_id: parseInt(departmentId),
        staff_id: selectedStaff.map((id) => parseInt(id)),
      });

      setOpen(false);
      onDivisionCreated();
    } catch (err) {
      console.error("Error creating division:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create division"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Division
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Division</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new division.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="division-name">Division Name</Label>
            <Input
              id="division-name"
              value={divisionName}
              onChange={(e) => setDivisionName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="office-location">Office Location</Label>
            <Input
              id="office-location"
              value={officeLocation}
              onChange={(e) => setOfficeLocation(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={departmentId}
              onValueChange={(value) => setDepartmentId(value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((department) => (
                  <SelectItem
                    key={department.id}
                    value={department.id.toString()}
                  >
                    {department.department_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {departmentError && (
              <p className="text-sm text-red-500">{departmentError}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Staff Members</Label>
            <Input
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-2"
            />
            <div className="max-h-40 overflow-y-auto space-y-2">
              {filteredStaff.map((staff) => (
                <div key={staff.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`staff-${staff.id}`}
                    checked={selectedStaff.includes(staff.id.toString())}
                    onCheckedChange={(checked) => {
                      setSelectedStaff((prev) =>
                        checked
                          ? [...prev, staff.id.toString()]
                          : prev.filter((id) => id !== staff.id.toString())
                      );
                    }}
                  />
                  <Label htmlFor={`staff-${staff.id}`}>
                    {staff.first_name} {staff.last_name}
                  </Label>
                </div>
              ))}
            </div>
            {staffError && <p className="text-sm text-red-500">{staffError}</p>}
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Division
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

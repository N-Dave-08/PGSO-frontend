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
import { Checkbox } from "@/components/ui/checkbox";
import { getAllDivisions } from "@/lib/api/divisions";
import { createDepartment, getDepartments } from "@/lib/api/department";
import { Division } from "@/types";
import { getUsers } from "@/lib/api/users";
import { User } from "@/types/users";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { secureStorage } from "@/lib/utils/encryption";
import { Department } from "@/types/departments";

interface CreateDepartmentProps {
  onDepartmentCreated: () => Promise<void>;
}

export default function CreateDepartment({
  onDepartmentCreated,
}: CreateDepartmentProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [departmentName, setDepartmentName] = useState<string>("");
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [selectedDivisions, setSelectedDivisions] = useState<number[]>([]);
  const [heads, setHeads] = useState<User[]>([]);
  const [selectedHead, setSelectedHead] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredDivisions = divisions.filter((division) =>
    division.division_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check authentication first
        const token = await secureStorage.get("token");
        if (!token) {
          console.error("No authentication token found");
          window.location.href = "/";
          return;
        }

        // Fetch all divisions
        const divisionsResponse = await getAllDivisions();
        const allDivisions = divisionsResponse?.divisions?.data || [];

        // Fetch all departments to check which divisions are already assigned
        const departmentsResponse = await getDepartments();
        const departments = departmentsResponse?.departments || [];

        // Create a set of assigned division IDs
        const assignedDivisionIds = new Set();
        // Create a set of assigned head IDs
        const assignedHeadIds = new Set();

        departments.forEach((department: Department) => {
          if (department.divisions && Array.isArray(department.divisions)) {
            department.divisions.forEach((division) => {
              assignedDivisionIds.add(division.id);
            });
          }
          // Add the department's head ID to the set if it exists
          if (department.head && department.head.id) {
            assignedHeadIds.add(department.head.id);
          }
        });

        // Filter out divisions that are already assigned to departments
        const unassignedDivisions = allDivisions.filter(
          (division: Division) => !assignedDivisionIds.has(division.id)
        );

        setDivisions(unassignedDivisions);

        // Fetch users with head role
        const usersResponse = await getUsers(1, { role_name: "head" });
        // Filter out heads that are already assigned to departments
        const unassignedHeads = (usersResponse.user || []).filter(
          (head) => !assignedHeadIds.has(head.id)
        );
        setHeads(unassignedHeads);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        if (
          error instanceof Error &&
          error.message.includes("Authentication")
        ) {
          window.location.href = "/";
        }
        setDivisions([]);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  const handleDivisionToggle = (divisionId: number) => {
    setSelectedDivisions((prev) => {
      if (prev.includes(divisionId)) {
        return prev.filter((id) => id !== divisionId);
      } else {
        return [...prev, divisionId];
      }
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError(null);

    try {
      await createDepartment(
        departmentName,
        selectedDivisions,
        selectedHead ? parseInt(selectedHead) : undefined
      );
      setOpen(false);
      setDepartmentName("");
      setSelectedDivisions([]);
      setSelectedHead("");
      await onDepartmentCreated();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        if (
          typeof err.response.data.error === "object" &&
          err.response.data.error !== null
        ) {
          setErrors(err.response.data.error);
        } else {
          setGeneralError(
            err.response.data.message ||
              "An unexpected error format was received."
          );
        }
      } else if (axios.isAxiosError(err) && err.response?.data?.message) {
        setGeneralError(err.response.data.message);
      } else if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Department</DialogTitle>
          <DialogDescription>
            Fill in the department details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="departmentName">Department Name</Label>
            <Input
              id="departmentName"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder="Enter department name"
              required
            />
            {errors.department_name && (
              <div className="text-sm text-red-500 mt-1">
                {errors.department_name[0]}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="head">Department Head</Label>
            <Select value={selectedHead} onValueChange={setSelectedHead}>
              <SelectTrigger>
                <SelectValue placeholder="Select a head" />
              </SelectTrigger>
              <SelectContent>
                {heads.map((head) => (
                  <SelectItem key={head.id} value={head.id.toString()}>
                    {head.first_name.charAt(0).toUpperCase() +
                      head.first_name.slice(1)}{" "}
                    {head.last_name.charAt(0).toUpperCase() +
                      head.last_name.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.head_id && (
              <div className="text-sm text-red-500 mt-1">
                {errors.head_id[0]}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Divisions</Label>
            <div className="mb-2">
              <Input
                type="text"
                placeholder="Search divisions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-2"
              />
            </div>
            <div className="space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-2">
              {filteredDivisions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">
                  {searchQuery
                    ? "No divisions found"
                    : "No divisions available"}
                </p>
              ) : (
                filteredDivisions.map((division) => (
                  <div
                    key={division.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`division-${division.id}`}
                      checked={selectedDivisions.includes(division.id)}
                      onCheckedChange={() => handleDivisionToggle(division.id)}
                    />
                    <label
                      htmlFor={`division-${division.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {division.division_name}
                    </label>
                  </div>
                ))
              )}
            </div>
            {errors.division_id && (
              <div className="text-sm text-red-500 mt-1">
                {errors.division_id[0]}
              </div>
            )}
          </div>
          {generalError && (
            <div className="text-sm text-red-500">{generalError}</div>
          )}
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Department
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { getDivisions } from "@/lib/api/divisions";
import { updateDepartment, getDepartments } from "@/lib/api/department";
import { Division, Department } from "@/types";
import { getUsers } from "@/lib/api/users";
import { User } from "@/types/users";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditDepartmentProps {
  department: Department;
  onDepartmentUpdated: () => Promise<void>;
}

export default function EditDepartment({
  department,
  onDepartmentUpdated,
}: EditDepartmentProps) {
  const [departmentName, setDepartmentName] = useState<string>(
    department.department_name
  );
  const [acronym, setAcronym] = useState<string>(department.acronym);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [selectedDivisions, setSelectedDivisions] = useState<number[]>(
    department.divisions.map((div) => div.id)
  );
  const [heads, setHeads] = useState<User[]>([]);
  const [selectedHead, setSelectedHead] = useState<string>(
    department.head?.id ? department.head.id.toString() : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all divisions
        const divisionsResponse = await getDivisions();
        const allDivisions = divisionsResponse?.divisions?.data || [];

        // Fetch all departments to check which divisions are already assigned
        const departmentsResponse = await getDepartments();
        const departments = departmentsResponse?.departments || [];

        // Create a set of assigned division IDs (excluding current department's divisions)
        const assignedDivisionIds = new Set();
        departments.forEach((dept: Department) => {
          // Skip the current department being edited
          if (dept.id !== department.id) {
            if (dept.divisions && Array.isArray(dept.divisions)) {
              dept.divisions.forEach((division) => {
                assignedDivisionIds.add(division.id);
              });
            }
          }
        });

        console.log("All Divisions:", allDivisions);
        console.log(
          "Assigned Division IDs (excluding current dept):",
          Array.from(assignedDivisionIds)
        );

        // Filter to show only unassigned divisions plus current department's divisions
        const availableDivisions = allDivisions.filter(
          (division: Division) =>
            !assignedDivisionIds.has(division.id) ||
            department.divisions.some((dept_div) => dept_div.id === division.id)
        );

        console.log("Available Divisions:", availableDivisions);
        setDivisions(availableDivisions);

        // Fetch users with head role
        const usersResponse = await getUsers(1, { role_name: "head" });
        setHeads(usersResponse.user || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load data");
      }
    };

    fetchData();
  }, [department.id, department.divisions]); // Add department.divisions as dependency since we use it in filtering

  useEffect(() => {
    setDepartmentName(department.department_name);
    setAcronym(department.acronym);
    setSelectedDivisions(department.divisions.map((div) => div.id));
    setSelectedHead(department.head?.id ? department.head.id.toString() : "");
  }, [
    department.department_name,
    department.acronym,
    department.divisions,
    department.head,
  ]);

  const filteredDivisions = divisions.filter((division) =>
    division.division_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    setError("");

    try {
      await updateDepartment(
        department.id,
        departmentName,
        acronym,
        selectedDivisions,
        selectedHead ? parseInt(selectedHead) : undefined
      );
      await onDepartmentUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
      </div>
      <div className="space-y-2">
        <Label htmlFor="acronym">Acronym</Label>
        <Input
          id="acronym"
          value={acronym}
          onChange={(e) => setAcronym(e.target.value)}
          placeholder="Enter acronym"
          required
        />
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
          {filteredDivisions.map((division) => (
            <div key={division.id} className="flex items-center space-x-2">
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
          ))}
        </div>
      </div>
      {error && <div className="text-sm text-red-500">{error}</div>}
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update Department
        </Button>
      </div>
    </form>
  );
}

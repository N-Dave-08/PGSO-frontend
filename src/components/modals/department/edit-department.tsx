"use client";

import { useState, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { updateDepartment } from "@/lib/api/department";
import { Department } from "@/types";
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
  const [heads, setHeads] = useState<User[]>([]);
  const [selectedHead, setSelectedHead] = useState<string>(
    department.head?.id ? department.head.id.toString() : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeads = async () => {
      try {
        const usersResponse = await getUsers(1, { role_name: "head" });
        setHeads(usersResponse.user || []);
      } catch (error) {
        console.error("Failed to fetch heads:", error);
        setError("Failed to load department heads");
      }
    };

    fetchHeads();
  }, []);

  useEffect(() => {
    setDepartmentName(department.department_name);
    setSelectedHead(department.head?.id ? department.head.id.toString() : "");
  }, [department.department_name, department.head]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await updateDepartment(
        department.id,
        departmentName,
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
        <Label htmlFor="head">Department Head</Label>
        <Select value={selectedHead} onValueChange={setSelectedHead}>
          <SelectTrigger>
            <SelectValue placeholder="Select a head" />
          </SelectTrigger>
          <SelectContent>
            {heads.map((head) => (
              <SelectItem key={head.id} value={head.id.toString()}>
                {head.first_name} {head.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

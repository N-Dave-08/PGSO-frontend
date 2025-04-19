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
import { getCategories } from "@/lib/api/categories";
import { getUsers } from "@/lib/api/users";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Category, User } from "@/types";

interface CreateDivisionProps {
  onDivisionCreated: () => void;
}

export default function CreateDivision({
  onDivisionCreated,
}: CreateDivisionProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [divisionName, setDivisionName] = useState<string>("");
  const [officeLocation, setOfficeLocation] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [staffMembers, setStaffMembers] = useState<User[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [staffError, setStaffError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingCategories(true);
        setCategoryError(null);
        const categoryData = await getCategories();
        setCategories(categoryData.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategoryError(
          err instanceof Error ? err.message : "Failed to load categories"
        );
      } finally {
        setLoadingCategories(false);
      }

      try {
        setLoadingStaff(true);
        setStaffError(null);
        const staffData = await getUsers(1);
        const staffOnly = (staffData.user || []).filter(
          (user) => user.role_name === "staff"
        );
        setStaffMembers(staffOnly);
      } catch (err) {
        console.error("Error fetching staff:", err);
        setStaffError(
          err instanceof Error ? err.message : "Failed to load staff members"
        );
      } finally {
        setLoadingStaff(false);
      }
    };

    if (open) {
      fetchInitialData();
    }
    if (!open) {
      setDivisionName("");
      setOfficeLocation("");
      setCategoryId("");
      setSelectedStaff([]);
      setError(null);
      setCategoryError(null);
      setStaffError(null);
    }
  }, [open]);

  const handleStaffChange = (staffId: string) => {
    setSelectedStaff((current) =>
      current.includes(staffId)
        ? current.filter((id) => id !== staffId)
        : [...current, staffId]
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createDivision({
        division_name: divisionName,
        office_location: officeLocation,
        category_id: parseInt(categoryId, 10),
        staff_id: selectedStaff.map((id) => parseInt(id, 10)),
      });

      setOpen(false);
      onDivisionCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error creating division:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add Division
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Division</DialogTitle>
          <DialogDescription>
            Fill in the division details below.
          </DialogDescription>
        </DialogHeader>
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
            <Label htmlFor="category">Category</Label>
            <Select
              value={categoryId}
              onValueChange={setCategoryId}
              required
              disabled={loadingCategories}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {loadingCategories ? (
                  <SelectItem value="loading" disabled>
                    <Loader2 className="mr-2 inline-block h-4 w-4 animate-spin" />
                    Loading categories...
                  </SelectItem>
                ) : categoryError ? (
                  <SelectItem value="error" disabled>
                    Error: {categoryError}
                  </SelectItem>
                ) : categories.length === 0 ? (
                  <SelectItem value="empty" disabled>
                    No Categories Found
                  </SelectItem>
                ) : (
                  categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.category_name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {categoryError && !loadingCategories && (
              <p className="text-sm text-red-500">{categoryError}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Add Staff Members</Label>
            {loadingStaff ? (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
                staff...
              </div>
            ) : staffError ? (
              <div className="text-sm text-red-500">Error: {staffError}</div>
            ) : staffMembers.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No staff members found.
              </div>
            ) : (
              <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto rounded-md border p-2">
                {staffMembers.map((staff: User) => (
                  <div key={staff.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`staff-${staff.id}`}
                      checked={selectedStaff.includes(staff.id.toString())}
                      onCheckedChange={() =>
                        handleStaffChange(staff.id.toString())
                      }
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
            {staffError && !loadingStaff && (
              <p className="text-sm text-red-500">{staffError}</p>
            )}
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || loadingCategories || loadingStaff}
            >
              {(isLoading || loadingCategories || loadingStaff) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isLoading ? "Creating..." : "Create Division"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

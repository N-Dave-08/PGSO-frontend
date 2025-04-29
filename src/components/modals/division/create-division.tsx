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
import { createDivision, getAllDivisions } from "@/lib/api/divisions";
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
import { Division } from "@/types";
import { Category } from "@/types/categories";
import { User } from "@/types/users";

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
  const [selectedPersonnel, setSelectedPersonnel] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [staffMembers, setStaffMembers] = useState<User[]>([]);
  const [personnelMembers, setPersonnelMembers] = useState<User[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [loadingPersonnel, setLoadingPersonnel] = useState(true);
  const [staffError, setStaffError] = useState<string | null>(null);
  const [personnelError, setPersonnelError] = useState<string | null>(null);
  const [allDivisions, setAllDivisions] = useState<Division[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [personnelSearchQuery, setPersonnelSearchQuery] = useState<string>("");

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
        const staffData = await getUsers(1, { role_name: "staff" });
        setStaffMembers(staffData.user || []);

        // Fetch all divisions to check staff assignments
        const divisionsResponse = await getAllDivisions();
        setAllDivisions(divisionsResponse.divisions.data || []);
      } catch (err) {
        console.error("Error fetching staff:", err);
        setStaffError(
          err instanceof Error ? err.message : "Failed to load staff members"
        );
      } finally {
        setLoadingStaff(false);
      }

      try {
        setLoadingPersonnel(true);
        setPersonnelError(null);
        const personnelData = await getUsers(1, { role_name: "personnel" });
        setPersonnelMembers(personnelData.user || []);
      } catch (err) {
        console.error("Error fetching personnel:", err);
        setPersonnelError(
          err instanceof Error
            ? err.message
            : "Failed to load personnel members"
        );
      } finally {
        setLoadingPersonnel(false);
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
      setSelectedPersonnel([]);
      setError(null);
      setCategoryError(null);
      setStaffError(null);
      setPersonnelError(null);
      setSearchQuery("");
      setPersonnelSearchQuery("");
    }
  }, [open]);

  // Filter out staff that are already assigned to other divisions
  const availableStaff = staffMembers.filter((staff) => {
    // Check if staff is assigned to any division
    const isAssignedToAnyDivision = allDivisions.some((div) =>
      div.staff.some((s) => s.id === staff.id)
    );

    return !isAssignedToAnyDivision;
  });

  const filteredStaff = availableStaff.filter((staff) =>
    `${staff.first_name} ${staff.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Filter out personnel that are already assigned to other divisions
  const availablePersonnel = personnelMembers.filter((personnel) => {
    // Check if personnel is assigned to any division
    const isAssignedToAnyDivision = allDivisions.some((div) =>
      div.personnel.some((p) => p.id === personnel.id)
    );

    return !isAssignedToAnyDivision;
  });

  const filteredPersonnel = availablePersonnel.filter((personnel) =>
    `${personnel.first_name} ${personnel.last_name}`
      .toLowerCase()
      .includes(personnelSearchQuery.toLowerCase())
  );

  const handleStaffChange = (staffId: string) => {
    setSelectedStaff((current) =>
      current.includes(staffId)
        ? current.filter((id) => id !== staffId)
        : [...current, staffId]
    );
  };

  const handlePersonnelChange = (personnelId: string) => {
    setSelectedPersonnel((current) =>
      current.includes(personnelId)
        ? current.filter((id) => id !== personnelId)
        : [...current, personnelId]
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
        personnel_id: selectedPersonnel.map((id) => parseInt(id, 10)),
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
        <Button size="sm">
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
            <div className="mb-2">
              <Input
                type="text"
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-2"
              />
            </div>
            {loadingStaff ? (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
                staff...
              </div>
            ) : staffError ? (
              <div className="text-sm text-red-500">Error: {staffError}</div>
            ) : filteredStaff.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No available staff members found.
              </div>
            ) : (
              <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto rounded-md border p-2">
                {filteredStaff.map((staff: User) => (
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
          <div className="space-y-2">
            <Label>Add Personnel Members</Label>
            <div className="mb-2">
              <Input
                type="text"
                placeholder="Search personnel..."
                value={personnelSearchQuery}
                onChange={(e) => setPersonnelSearchQuery(e.target.value)}
                className="mb-2"
              />
            </div>
            {loadingPersonnel ? (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
                personnel...
              </div>
            ) : personnelError ? (
              <div className="text-sm text-red-500">
                Error: {personnelError}
              </div>
            ) : filteredPersonnel.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No available personnel members found.
              </div>
            ) : (
              <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto rounded-md border p-2">
                {filteredPersonnel.map((personnel: User) => (
                  <div
                    key={personnel.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`personnel-${personnel.id}`}
                      checked={selectedPersonnel.includes(
                        personnel.id.toString()
                      )}
                      onCheckedChange={() =>
                        handlePersonnelChange(personnel.id.toString())
                      }
                    />
                    <label
                      htmlFor={`personnel-${personnel.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {personnel.first_name} {personnel.last_name}
                    </label>
                  </div>
                ))}
              </div>
            )}
            {personnelError && !loadingPersonnel && (
              <p className="text-sm text-red-500">{personnelError}</p>
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
              disabled={
                isLoading ||
                loadingCategories ||
                loadingStaff ||
                loadingPersonnel
              }
            >
              {(isLoading ||
                loadingCategories ||
                loadingStaff ||
                loadingPersonnel) && (
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

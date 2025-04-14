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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Category } from "@/types";

interface Staff {
  id: number;
  name: string;
  position: string;
}

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

  const staffMembers: Staff[] = [
    { id: 1, name: "John Doe", position: "Manager" },
    { id: 2, name: "Jane Smith", position: "Developer" },
    { id: 3, name: "Michael Johnson", position: "Designer" },
    { id: 4, name: "Sarah Williams", position: "Marketing" },
    { id: 5, name: "Robert Brown", position: "Sales" },
    { id: 6, name: "Emily Davis", position: "HR" },
    { id: 7, name: "William Wilson", position: "Finance" },
    { id: 8, name: "Jessica Taylor", position: "IT" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await getCategories();
        setCategories(data.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

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
        department_id: parseInt(categoryId, 10),
        staff: selectedStaff.map((id) => {
          const foundStaff = staffMembers.find(
            (s) => s.id === parseInt(id, 10)
          );
          return {
            id: parseInt(id, 10),
            name: foundStaff?.name || "",
            position: foundStaff?.position || "",
          };
        }),
      });

      setOpen(false);
      setDivisionName("");
      setOfficeLocation("");
      setCategoryId("");
      setSelectedStaff([]);
      onDivisionCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
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
          <div>
            <Label htmlFor="divisionName">Division Name</Label>
            <Input
              id="divisionName"
              value={divisionName}
              onChange={(e) => setDivisionName(e.target.value)}
              placeholder="Enter division name"
              required
            />
          </div>
          <div>
            <Label htmlFor="officeLocation">Office Location</Label>
            <Input
              id="officeLocation"
              value={officeLocation}
              onChange={(e) => setOfficeLocation(e.target.value)}
              placeholder="Enter office location"
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {loadingCategories ? (
                  <SelectItem value="">Loading categories...</SelectItem>
                ) : categories.length === 0 ? (
                  <SelectItem value="empty">No Categories</SelectItem>
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
          </div>
          <div className="space-y-2">
            <Label>Add Staff Members</Label>
            <div className="grid grid-cols-2 gap-2">
              {staffMembers.map((staff) => (
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
                    {staff.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
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

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
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { updateDivision, getDivisions } from "@/lib/api/divisions";
import { Division } from "@/types";
import { getUsers } from "@/lib/api/users";
import { User } from "@/types/users";
import { toast } from "sonner";

interface EditDivisionProps {
  division: Division;
  onDivisionUpdated: () => Promise<void>;
  trigger: React.ReactNode;
}

export default function EditDivision({
  division,
  onDivisionUpdated,
  trigger,
}: EditDivisionProps) {
  const [open, setOpen] = useState(false);
  const [divisionName, setDivisionName] = useState<string>(
    division.division_name
  );
  const [officeLocation, setOfficeLocation] = useState<string>(
    division.office_location
  );
  const [staffMembers, setStaffMembers] = useState<User[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<number[]>(
    division.staff.map((staff) => staff.id)
  );
  const [personnelMembers, setPersonnelMembers] = useState<User[]>([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState<number[]>(
    division.personnel.map((personnel) => personnel.id)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [loadingPersonnel, setLoadingPersonnel] = useState(true);
  const [loadingDivisions, setLoadingDivisions] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [personnelSearchQuery, setPersonnelSearchQuery] = useState<string>("");
  const [allDivisions, setAllDivisions] = useState<Division[]>([]);
  const [dataInitialized, setDataInitialized] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!open) return;

      setLoadingStaff(true);
      setLoadingPersonnel(true);
      setLoadingDivisions(true);
      setDataInitialized(false);

      try {
        // Fetch all divisions first to check staff assignments
        const divisionsResponse = await getDivisions();
        setAllDivisions(divisionsResponse.divisions.data || []);
        setLoadingDivisions(false);

        // Fetch users with staff role
        const usersResponse = await getUsers(1, { role_name: "staff" });
        setStaffMembers(usersResponse.user || []);
        setLoadingStaff(false);

        // Fetch users with personnel role
        const personnelResponse = await getUsers(1, { role_name: "personnel" });
        setPersonnelMembers(personnelResponse.user || []);
        setLoadingPersonnel(false);

        setDataInitialized(true);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load division data");
      }
    };

    fetchData();

    return () => {
      // Reset states when modal closes
      if (!open) {
        setStaffMembers([]);
        setPersonnelMembers([]);
        setAllDivisions([]);
        setDataInitialized(false);
      }
    };
  }, [open]);

  useEffect(() => {
    setDivisionName(division.division_name);
    setOfficeLocation(division.office_location);
    setSelectedStaff(division.staff.map((staff) => staff.id));
    setSelectedPersonnel(division.personnel.map((personnel) => personnel.id));
  }, [division]);

  // Only compute filtered lists when all data is loaded
  const availableStaff = dataInitialized
    ? staffMembers.filter((staff) => {
        // If staff is already selected in current division, show them
        if (selectedStaff.includes(staff.id)) {
          return true;
        }

        // Check if staff is assigned to any other division
        const isAssignedToOtherDivision = allDivisions.some(
          (div) =>
            div.id !== division.id && // Not current division
            div.staff.some((s) => s.id === staff.id) // Staff is assigned to this division
        );

        return !isAssignedToOtherDivision;
      })
    : [];

  const filteredStaff = dataInitialized
    ? availableStaff.filter((staff) =>
        `${staff.first_name} ${staff.last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : [];

  const handleStaffToggle = (staffId: number) => {
    setSelectedStaff((prev) => {
      if (prev.includes(staffId)) {
        return prev.filter((id) => id !== staffId);
      } else {
        return [...prev, staffId];
      }
    });
  };

  // Filter out personnel that are already assigned to other divisions
  const availablePersonnel = dataInitialized
    ? personnelMembers.filter((personnel) => {
        // If personnel is already selected in current division, show them
        if (selectedPersonnel.includes(personnel.id)) {
          return true;
        }

        // Check if personnel is assigned to any other division
        const isAssignedToOtherDivision = allDivisions.some(
          (div) =>
            div.id !== division.id && // Not current division
            div.personnel.some((p) => p.id === personnel.id) // Personnel is assigned to this division
        );

        return !isAssignedToOtherDivision;
      })
    : [];

  const filteredPersonnel = dataInitialized
    ? availablePersonnel.filter((personnel) =>
        `${personnel.first_name} ${personnel.last_name}`
          .toLowerCase()
          .includes(personnelSearchQuery.toLowerCase())
      )
    : [];

  const handlePersonnelToggle = (personnelId: number) => {
    setSelectedPersonnel((prev) => {
      if (prev.includes(personnelId)) {
        return prev.filter((id) => id !== personnelId);
      } else {
        return [...prev, personnelId];
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
        personnel_id: selectedPersonnel,
      };

      console.log("Submitting division update:", updateData);

      await updateDivision(division.id, updateData);
      toast.success("Division updated successfully");
      setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Division</DialogTitle>
          <DialogDescription>
            Update the division details below.
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
            <Label>Add Staff Members</Label>
            <Input
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {!dataInitialized || loadingStaff || loadingDivisions ? (
              <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading available staff...
              </div>
            ) : filteredStaff.length === 0 ? (
              <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                No available staff members found.
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
          <div className="space-y-2">
            <Label>Add Personnel Members</Label>
            <Input
              type="text"
              placeholder="Search personnel..."
              value={personnelSearchQuery}
              onChange={(e) => setPersonnelSearchQuery(e.target.value)}
            />
            {!dataInitialized || loadingPersonnel || loadingDivisions ? (
              <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading available personnel...
              </div>
            ) : filteredPersonnel.length === 0 ? (
              <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                No available personnel members found.
              </div>
            ) : (
              <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto rounded-md border p-2">
                {filteredPersonnel.map((personnel) => (
                  <div
                    key={personnel.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`personnel-${personnel.id}`}
                      checked={selectedPersonnel.includes(personnel.id)}
                      onCheckedChange={() =>
                        handlePersonnelToggle(personnel.id)
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
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Updating..." : "Update Division"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

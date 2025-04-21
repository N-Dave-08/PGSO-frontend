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
import { updateCategory } from "@/lib/api/categories";
import { Category } from "@/types";
import { getUsers } from "@/lib/api/users";
import { User } from "@/types/users";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface EditCategoryProps {
  category: Category;
  onCategoryUpdated: () => Promise<void>;
  trigger: React.ReactNode;
}

export default function EditCategory({
  category,
  onCategoryUpdated,
  trigger,
}: EditCategoryProps) {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState(category.category_name);
  const [description, setDescription] = useState(category.description || "");
  const [personnelMembers, setPersonnelMembers] = useState<User[]>([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState<number[]>(
    category.personnel?.map((p) => p.id) || []
  );
  const [selectedTeamLeads, setSelectedTeamLeads] = useState<number[]>(
    category.personnel?.filter((p) => p.is_team_lead).map((p) => p.id) || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPersonnel, setLoadingPersonnel] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!open) return;

      try {
        setLoadingPersonnel(true);
        const personnelResponse = await getUsers(1, { role_name: "personnel" });
        setPersonnelMembers(personnelResponse.user || []);
      } catch (error) {
        console.error("Failed to fetch personnel:", error);
        setError("Failed to load personnel data");
      } finally {
        setLoadingPersonnel(false);
      }
    };

    fetchData();

    return () => {
      if (!open) {
        setPersonnelMembers([]);
        setSearchQuery("");
      }
    };
  }, [open]);

  useEffect(() => {
    setCategoryName(category.category_name);
    setDescription(category.description || "");
    setSelectedPersonnel(category.personnel?.map((p) => p.id) || []);
    setSelectedTeamLeads(
      category.personnel?.filter((p) => p.is_team_lead).map((p) => p.id) || []
    );
  }, [category]);

  const filteredPersonnel = personnelMembers.filter((personnel) =>
    `${personnel.first_name} ${personnel.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handlePersonnelToggle = (personnelId: number) => {
    setSelectedPersonnel((prev) => {
      if (prev.includes(personnelId)) {
        // If removing personnel, also remove from team leads if they are one
        setSelectedTeamLeads((current) =>
          current.filter((id) => id !== personnelId)
        );
        return prev.filter((id) => id !== personnelId);
      } else {
        return [...prev, personnelId];
      }
    });
  };

  const handleTeamLeadToggle = (personnelId: number) => {
    setSelectedTeamLeads((prev) => {
      if (prev.includes(personnelId)) {
        return prev.filter((id) => id !== personnelId);
      } else {
        // If making someone a team lead, ensure they are also selected as personnel
        if (!selectedPersonnel.includes(personnelId)) {
          setSelectedPersonnel((current) => [...current, personnelId]);
        }
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
        category_name: categoryName,
        description: description,
        personnel_ids: selectedPersonnel,
        teamlead_ids: selectedTeamLeads,
      };

      await updateCategory(category.id, updateData);
      toast.success("Category updated successfully");
      setOpen(false);
      await onCategoryUpdated();
    } catch (err) {
      console.error("Category update error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update the Category"
      );
      toast.error(
        err instanceof Error ? err.message : "Failed to update the Category"
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
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the category details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name</Label>
            <Input
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter category description"
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Personnel Members</Label>
            <Input
              type="text"
              placeholder="Search personnel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {loadingPersonnel ? (
              <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading personnel...
              </div>
            ) : filteredPersonnel.length === 0 ? (
              <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                No personnel members found.
              </div>
            ) : (
              <div className="space-y-2 max-h-[200px] overflow-y-auto rounded-md border p-2">
                {filteredPersonnel.map((personnel) => (
                  <div key={personnel.id} className="flex flex-col gap-1">
                    <div className="flex items-center space-x-2">
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
                    {selectedPersonnel.includes(personnel.id) && (
                      <div className="flex items-center space-x-2 ml-6">
                        <Checkbox
                          id={`teamlead-${personnel.id}`}
                          checked={selectedTeamLeads.includes(personnel.id)}
                          onCheckedChange={() =>
                            handleTeamLeadToggle(personnel.id)
                          }
                        />
                        <label
                          htmlFor={`teamlead-${personnel.id}`}
                          className="text-sm text-muted-foreground"
                        >
                          Team Lead
                        </label>
                      </div>
                    )}
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
              {isLoading ? "Updating..." : "Update Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
import { getCategories } from "@/lib/api/categories";

interface EditCategoryProps {
  category: Category;
  onCategoryUpdated: () => Promise<void>;
  trigger?: React.ReactNode;
}

export default function EditCategory({
  category,
  onCategoryUpdated,
  trigger,
}: EditCategoryProps) {
  const [categoryName, setCategoryName] = useState(category.category_name);
  const [description, setDescription] = useState(category.description || "");
  const [personnelMembers, setPersonnelMembers] = useState<User[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [selectedPersonnel, setSelectedPersonnel] = useState<number[]>(
    category.personnel?.map((p) => p.id) || []
  );
  const [selectedTeamLeads, setSelectedTeamLeads] = useState<number[]>(
    category.personnel?.filter((p) => p.is_team_lead).map((p) => p.id) || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPersonnel, setLoadingPersonnel] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingPersonnel(true);
        setLoadingCategories(true);

        // Fetch all categories first
        const categoriesResponse = await getCategories();
        if (!categoriesResponse.categories) {
          throw new Error("Failed to fetch categories");
        }
        setAllCategories(categoriesResponse.categories);
        setLoadingCategories(false);

        // Fetch all personnel
        const personnelResponse = await getUsers(1, { role_name: "personnel" });
        if (!personnelResponse.user) {
          throw new Error("Failed to fetch personnel");
        }
        setPersonnelMembers(personnelResponse.user);
        setLoadingPersonnel(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load data");
        toast.error("Failed to load data");
      } finally {
        setLoadingPersonnel(false);
        setLoadingCategories(false);
      }
    };

    fetchData();
  }, []); // Only fetch once when component mounts

  useEffect(() => {
    setCategoryName(category.category_name);
    setDescription(category.description || "");
    setSelectedPersonnel(category.personnel?.map((p) => p.id) || []);
    setSelectedTeamLeads(
      category.personnel?.filter((p) => p.is_team_lead).map((p) => p.id) || []
    );
  }, [category]);

  // Filter personnel that are not assigned to any category or are assigned to current category
  const availablePersonnel = personnelMembers.filter((personnel) => {
    // If personnel is already selected in current category, include them
    if (selectedPersonnel.includes(personnel.id)) {
      return true;
    }

    // Check if personnel is assigned to any other category
    return !allCategories.some(
      (cat) =>
        cat.id !== category.id && // Skip current category
        cat.personnel?.some((p) => p.id === personnel.id) // Check if assigned to other category
    );
  });

  const filteredPersonnel = availablePersonnel.filter((personnel) =>
    `${personnel.first_name} ${personnel.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const handlePersonnelToggle = (personnelId: number) => {
    setSelectedPersonnel((prev) => {
      const newSelected = prev.includes(personnelId)
        ? prev.filter((id) => id !== personnelId)
        : [...prev, personnelId];
      return newSelected;
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
        personnel_ids: selectedPersonnel || [],
        teamlead_ids: selectedTeamLeads || [],
      };

      const response = await updateCategory(category.id, updateData);

      if (response.isSuccess) {
        toast.success(response.message || "Category updated successfully");
        // Ensure we cleanup any lingering modal state
        document.body.style.pointerEvents = "";
        await onCategoryUpdated();
      } else {
        throw new Error(response.message || "Failed to update category");
      }
    } catch (err) {
      console.error("Category update error:", err);
      let errorMessage = "Failed to update the Category";

      if (err instanceof Error && err.message.includes("<!DOCTYPE")) {
        errorMessage =
          "Lost connection to server. Please check your internet connection and try again.";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return trigger ? (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Make changes to the category details below.
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
            {loadingPersonnel || loadingCategories ? (
              <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading personnel...
              </div>
            ) : filteredPersonnel.length === 0 ? (
              <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
                No unassigned personnel available
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
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Updating..." : "Update Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  ) : (
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
        {loadingPersonnel || loadingCategories ? (
          <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading personnel...
          </div>
        ) : filteredPersonnel.length === 0 ? (
          <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
            No unassigned personnel available
          </div>
        ) : (
          <div className="space-y-2 max-h-[200px] overflow-y-auto rounded-md border p-2">
            {filteredPersonnel.map((personnel) => (
              <div key={personnel.id} className="flex flex-col gap-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`personnel-${personnel.id}`}
                    checked={selectedPersonnel.includes(personnel.id)}
                    onCheckedChange={() => handlePersonnelToggle(personnel.id)}
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
                      onCheckedChange={() => handleTeamLeadToggle(personnel.id)}
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
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Updating..." : "Update Category"}
        </Button>
      </div>
    </form>
  );
}

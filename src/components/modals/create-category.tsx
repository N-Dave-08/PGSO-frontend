"use client";

import { FormEvent, useState } from "react";
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
import { createCategory } from "@/lib/api/categories";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Personnel {
  id: number;
  first_name: string;
  last_name: string;
}

interface CreateCategoryProps {
  onCategoryCreated: () => void;
  personnel: Personnel[];
}

export default function CreateCategory({
  onCategoryCreated,
  personnel,
}: CreateCategoryProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedPersonnel, setSelectedPersonnel] = useState<number[]>([]);
  const [selectedTeamLeads, setSelectedTeamLeads] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePersonnelChange = (personnelId: number) => {
    setSelectedPersonnel((current) =>
      current.includes(personnelId)
        ? current.filter((id) => id !== personnelId)
        : [...current, personnelId]
    );
  };

  const handleTeamLeadChange = (personnelId: number) => {
    // When selecting a team lead, automatically add them to personnel if not already added
    setSelectedTeamLeads((current) => {
      const newTeamLeads = current.includes(personnelId)
        ? current.filter((id) => id !== personnelId)
        : [...current, personnelId];

      if (
        !selectedPersonnel.includes(personnelId) &&
        !current.includes(personnelId)
      ) {
        setSelectedPersonnel((prev) => [...prev, personnelId]);
      }

      return newTeamLeads;
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await createCategory({
        category_name: categoryName,
        description: description,
        personnel_ids: selectedPersonnel,
        teamlead_ids: selectedTeamLeads,
      });

      if (response.isSuccess) {
        toast.success(response.message);
        setOpen(false);
        setCategoryName("");
        setDescription("");
        setSelectedPersonnel([]);
        setSelectedTeamLeads([]);
        onCategoryCreated();
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create category"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Plus className="mr-2 h-4 w-4" />
          Add New Category
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Category</DialogTitle>
          <DialogDescription>
            Fill in the category details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-base">Team Leads</Label>
              <ScrollArea className="h-[200px] w-full border p-4">
                <div className="space-y-4">
                  {personnel.map((person) => (
                    <div
                      key={`lead-${person.id}`}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`teamlead-${person.id}`}
                        checked={selectedTeamLeads.includes(person.id)}
                        onCheckedChange={() => handleTeamLeadChange(person.id)}
                      />
                      <label
                        htmlFor={`teamlead-${person.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {person.first_name} {person.last_name}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <Label className="text-base">Personnel</Label>
              <ScrollArea className="h-[200px] w-full border p-4">
                <div className="space-y-4">
                  {personnel.map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`personnel-${person.id}`}
                        checked={selectedPersonnel.includes(person.id)}
                        onCheckedChange={() => handlePersonnelChange(person.id)}
                        disabled={selectedTeamLeads.includes(person.id)}
                      />
                      <label
                        htmlFor={`personnel-${person.id}`}
                        className={`text-sm font-medium leading-none ${
                          selectedTeamLeads.includes(person.id)
                            ? "text-muted-foreground"
                            : ""
                        }`}
                      >
                        {person.first_name} {person.last_name}
                        {selectedTeamLeads.includes(person.id) &&
                          " (Team Lead)"}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

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
              Create Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

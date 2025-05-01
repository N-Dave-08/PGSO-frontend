"use client";

import { useState, FormEvent } from "react";
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
import { createRequest } from "@/lib/api/requests";
import { toast } from "sonner";

interface CreateRequestProps {
  onRequestCreated?: () => void;
}

export default function CreateRequest({
  onRequestCreated,
}: CreateRequestProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await createRequest({
        request_title: title,
        description,
        category_id: selectedCategory || undefined,
        file_path: file || undefined,
      });

      if (response.isSuccess) {
        toast.success(response.message);
        setOpen(false);
        setTitle("");
        setDescription("");
        setSelectedCategory(0);
        onRequestCreated?.();
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create request"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      // Check file type
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Please upload a valid image file (JPG or PNG)");
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Plus className="mr-2 h-4 w-4" />
          Create Request
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Request</DialogTitle>
          <DialogDescription>
            Fill in the request details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
              placeholder="Enter request title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError(null);
              }}
              placeholder="Enter request description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">Supporting File</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => {
                handleFileChange(e);
                setError(null);
              }}
              accept="image/jpeg,image/png"
              placeholder="Upload supporting file"
            />
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: JPG, PNG (max 5MB)
            </p>
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
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Request"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

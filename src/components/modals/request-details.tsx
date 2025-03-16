"use client";

import type React from "react";
import { Request } from "@/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { updateRequestStatus, assessRequest } from "@/lib/api/requests";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import axios, { type AxiosError } from "axios";

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);

interface RequestDetailsModalProps {
  request: Request;
  trigger: React.ReactNode;
  onRequestUpdate?: () => void;
}

export default function RequestDetailsModal({
  request,
  trigger,
  onRequestUpdate,
}: RequestDetailsModalProps) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<
    Array<{
      id: number;
      category_name: string;
      personnel: Array<{ id: number; name: string }>;
    }>
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    request.category_id?.toString()
  );
  const [selectedPersonnel, setSelectedPersonnel] = useState<number[]>(
    request.personnel?.map((p) => p.id) || []
  );
  const [isAssessing, setIsAssessing] = useState(false);
  const [completionFile, setCompletionFile] = useState<File | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [rejectionNote, setRejectionNote] = useState(
    localStorage.getItem("rejectionNote") || ""
  );
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);

  useEffect(() => {
    setUserRole(localStorage.getItem("role"));
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_BASE_URL + "/dropdown/categories",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.isSuccess) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleStatusUpdate = async (status: "Approved" | "Rejected") => {
    if (status === "Rejected" && !rejectionNote.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      if (status === "Rejected") {
        localStorage.setItem("rejectionNote", rejectionNote);
      }
      const response = await updateRequestStatus(request.id, status);

      if (response.isSuccess) {
        toast({
          title: "Success",
          description: response.message,
        });

        // Update local request state if available
        if (response.request) {
          request.status = response.request.status;
          if (status === "Rejected") {
            request.date_completed = response.request.date_rejected ?? null;
          }
        }

        onRequestUpdate?.();
        setOpen(false);
        setRejectionNote("");
        if (status === "Rejected") {
          localStorage.removeItem("rejectionNote");
        }
        setShowRejectionDialog(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update request status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAssessRequest = async () => {
    if (!selectedCategory) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }

    if (selectedPersonnel.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one personnel",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAssessing(true);
      const response = await assessRequest(request.id, {
        category_id: Number.parseInt(selectedCategory),
        personnel_ids: selectedPersonnel,
        status: "In Progress",
      });

      if (response.isSuccess) {
        toast({
          title: "Success",
          description: response.message,
        });
        onRequestUpdate?.();
        setOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to assess request",
        variant: "destructive",
      });
    } finally {
      setIsAssessing(false);
    }
  };

  const handleCompletionFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setCompletionFile(e.target.files[0]);
    }
  };

  const handleMarkAsComplete = async () => {
    if (!completionFile) {
      toast({
        title: "Error",
        description: "Please select a completion file",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCompleting(true);
      const formData = new FormData();
      formData.append("file_completion", completionFile);

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/pro/request/completion/${request.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        toast({
          title: "Success",
          description: response.data.message || "Request marked as complete",
        });
        await onRequestUpdate?.();
        setOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to mark request as complete",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Error",
        description: "Please provide a rating",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingFeedback(true);

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_BASE_URL + "/requests/feedback",
        {
          request_id: request.id,
          feedback,
          rating,
        }
      );

      if (response.data.isSuccess) {
        toast({
          title: "Success",
          description: "Feedback submitted successfully",
        });
        onRequestUpdate?.();
        setOpen(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to submit feedback",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Details</DialogTitle>
          <DialogDescription>
            Control No: {request.control_no}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex flex-col space-y-1">
              <span className="font-medium text-sm">Title:</span>
              <span>{request.request_title}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="font-medium text-sm">Description:</span>
              <span>{request.description}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="font-medium text-sm">Location:</span>
              <span>{request.requested_by.office_location}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="font-medium text-sm">Category:</span>
              <div>
                {userRole === "admin" && request.status === "For Process" ? (
                  <Select
                    defaultValue={request.category_id?.toString()}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categories</SelectLabel>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.category_name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm mt-1">
                    {categories.find((cat) => cat.id === request.category_id)
                      ?.category_name || "No category"}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="font-medium text-sm">Personnel:</span>
              <div className="space-y-2">
                {userRole === "admin" && request.status === "For Process" ? (
                  selectedCategory ? (
                    categories
                      .find((cat) => cat.id.toString() === selectedCategory)
                      ?.personnel.map((person) => (
                        <div
                          key={person.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`person-${person.id}`}
                            checked={selectedPersonnel.includes(person.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedPersonnel((prev) => [
                                  ...prev,
                                  person.id,
                                ]);
                              } else {
                                setSelectedPersonnel((prev) =>
                                  prev.filter((id) => id !== person.id)
                                );
                              }
                            }}
                          />
                          <label
                            htmlFor={`person-${person.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {person.name}
                          </label>
                        </div>
                      )) || "No personnel in this category"
                  ) : (
                    "Select a category to view personnel"
                  )
                ) : (
                  <p className="text-sm">
                    {Array.isArray(request.personnel) &&
                    request.personnel.length > 0
                      ? request.personnel.map((p) => p.name).join(", ")
                      : "No personnel assigned"}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <span className="font-medium text-sm">Status:</span>
              <span className="capitalize">{request.status}</span>
            </div>
            {request.status === "Returned" && (
              <div className="flex flex-col space-y-1">
                <span className="font-medium text-sm">Reason:</span>
                <span className="capitalize">{request.note}</span>
              </div>
            )}
            <div className="flex flex-col space-y-1">
              <span className="font-medium text-sm">Date Requested:</span>
              <span>
                {dayjs(request.date_requested)
                  .tz("Asia/Manila")
                  .format("MMM D, YYYY")}
              </span>
            </div>
            {request.date_completed && (
              <div className="flex flex-col space-y-1">
                <span className="font-medium text-sm">Date Completed:</span>
                <span>
                  {dayjs(request.date_completed)
                    .tz("Asia/Manila")
                    .format("MMM D, YYYY")}
                </span>
              </div>
            )}
            {userRole !== "staff" && (
              <div className="flex flex-col space-y-1">
                <span className="font-medium text-sm">Requested By:</span>
                <div>
                  <p>{`${request.requested_by.first_name} ${request.requested_by.last_name}`}</p>
                  <p className="text-sm text-muted-foreground">
                    {request.requested_by.department}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {request.requested_by.division}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {userRole === "personnel" &&
              request.status === "For Completion" && (
                <div className="flex flex-col space-y-1">
                  <span className="font-medium text-sm">Completion File:</span>
                  <div>
                    <Input
                      type="file"
                      onChange={handleCompletionFileChange}
                      accept="image/*"
                    />
                  </div>
                </div>
              )}

            {request.rating !== null && (
              <div className="flex flex-col space-y-1">
                <span className="font-medium text-sm">Rating:</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="text-2xl focus:outline-none transition-colors duration-150"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        {star <= (hoverRating || rating) ? (
                          <span className="text-yellow-400">★</span>
                        ) : (
                          <span className="text-gray-300 hover:text-yellow-200">
                            ★
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <span className="text-sm font-medium">
                      ({rating} {rating === 1 ? "star" : "stars"})
                    </span>
                  )}
                </div>
              </div>
            )}
            {request.feedback && (
              <div className="flex flex-col space-y-1">
                <span className="font-medium text-sm">Feedback:</span>
                <span>{request.feedback}</span>
              </div>
            )}
            {userRole === "staff" && request.status === "For Feedback" && (
              <div className="flex flex-col space-y-1">
                <span className="font-medium text-sm">Rating:</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="text-2xl focus:outline-none transition-colors duration-150"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        {star <= (hoverRating || rating) ? (
                          <span className="text-yellow-400">★</span>
                        ) : (
                          <span className="text-gray-300 hover:text-yellow-200">
                            ★
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <span className="text-sm font-medium">
                      ({rating} {rating === 1 ? "star" : "stars"})
                    </span>
                  )}
                </div>
              </div>
            )}
            {userRole === "staff" && request.status === "For Feedback" && (
              <div className="flex flex-col space-y-1">
                <span className="font-medium text-sm">Feedback:</span>
                <div>
                  <Input
                    type="text"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div className="space-y-4">
              {request.file_url && (
                <div>
                  <h4 className="font-medium mb-2">Supporting Image:</h4>
                  <div className="rounded-lg overflow-hidden border">
                    <Image
                      alt="supporting image"
                      src={request.file_url || "/placeholder.svg"}
                      height={200}
                      width={200}
                      className="w-full h-[150px] object-cover"
                    />
                  </div>
                </div>
              )}
              {request.file_completion_url && (
                <div>
                  <h4 className="font-medium mb-2">Completion:</h4>
                  <div className="rounded-lg overflow-hidden border">
                    <Image
                      alt="completion image"
                      src={request.file_completion_url || "/placeholder.svg"}
                      height={200}
                      width={200}
                      className="w-full h-[150px] object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center mt-6 space-x-2">
          {userRole === "admin" && request.status === "For Process" && (
            <Button onClick={handleAssessRequest} disabled={isAssessing}>
              {isAssessing ? "Loading..." : "Assign"}
            </Button>
          )}
          {userRole === "head" && request.status === "Pending" && (
            <>
              <Button
                onClick={() => handleStatusUpdate("Approved")}
                disabled={loading}
              >
                {loading ? "Loading..." : "Approve"}
              </Button>
              {!showRejectionDialog ? (
                <Button
                  variant="destructive"
                  onClick={() => setShowRejectionDialog(true)}
                  disabled={loading}
                >
                  Reject
                </Button>
              ) : (
                <div className="space-y-2">
                  <textarea
                    className="w-full min-h-[100px] p-2 border rounded-md"
                    placeholder="Please provide a reason for rejection..."
                    value={rejectionNote}
                    onChange={(e) => setRejectionNote(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleStatusUpdate("Rejected")}
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Confirm Rejection"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowRejectionDialog(false);
                        setRejectionNote("");
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
          {userRole === "personnel" && request.status === "For Completion" && (
            <Button onClick={handleMarkAsComplete} disabled={isCompleting}>
              {isCompleting ? "Loading..." : "Mark as Complete"}
            </Button>
          )}
          {userRole === "staff" && request.status === "For Feedback" && (
            <Button
              onClick={handleFeedbackSubmit}
              disabled={isSubmittingFeedback}
            >
              {isSubmittingFeedback ? "Loading..." : "Submit"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

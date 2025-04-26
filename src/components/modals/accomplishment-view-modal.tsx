import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Star } from "lucide-react";
import { format } from "date-fns";
import { Accomplishment } from "@/types";
import Image from "next/image";

interface AccomplishmentViewModalProps {
  accomplishment: Accomplishment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccomplishmentViewModal({
  accomplishment,
  open,
  onOpenChange,
}: AccomplishmentViewModalProps) {
  if (!accomplishment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] xl:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>Accomplishment Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[85vh]">
          <div className="grid gap-6 p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-2xl font-semibold tracking-tight">
                  {accomplishment.request_title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Control No: {accomplishment.control_no}
                </p>
              </div>
              <Badge
                variant={
                  accomplishment.status === "For Feedback"
                    ? "default"
                    : "secondary"
                }
              >
                {accomplishment.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Description</h4>
                  <p className="text-sm">{accomplishment.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Category</h4>
                    <p className="text-sm">{accomplishment.category_name}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Requested By</h4>
                    <p className="text-sm">
                      {accomplishment.requested_by.first_name}{" "}
                      {accomplishment.requested_by.last_name}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Date Requested</h4>
                    <p className="text-sm">
                      {format(new Date(accomplishment.date_requested), "PPP")}
                    </p>
                  </div>
                  {accomplishment.date_completed && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Date Completed</h4>
                      <p className="text-sm">
                        {format(new Date(accomplishment.date_completed), "PPP")}
                      </p>
                    </div>
                  )}
                </div>

                {accomplishment.personnel.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Personnel Involved</h4>
                    <div className="grid gap-2">
                      {accomplishment.personnel.map((person) => (
                        <div key={person.id} className="text-sm">
                          {person.name} ({person.email})
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {accomplishment.feedback && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Feedback</h4>
                      <p className="text-sm">{accomplishment.feedback}</p>
                    </div>
                  )}
                  {accomplishment.rating !== null && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Rating</h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{accomplishment.rating}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {accomplishment.file_url && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Request Photo</h4>
                      <div className="relative h-[300px] w-full overflow-hidden rounded-lg border bg-muted">
                        <Image
                          src={accomplishment.file_url}
                          alt="Request photo"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {accomplishment.file_completion_url && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Completion Photo</h4>
                      <div className="relative h-[300px] w-full overflow-hidden rounded-lg border bg-muted">
                        <Image
                          src={accomplishment.file_completion_url}
                          alt="Completion photo"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

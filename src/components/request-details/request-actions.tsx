"use client";

import { Request } from "@/types";
import { Button } from "@/components/ui/button";
import { useRequestDetailStore } from "@/store/request-detail-store";
import { useToast } from "@/hooks/use-toast";

interface RequestActionsProps {
  request: Request;
  onRequestUpdate?: () => void;
  onClose: () => void;
}

export function RequestActions({
  request,
  onRequestUpdate,
  onClose,
}: RequestActionsProps) {
  const { toast } = useToast();
  const {
    userRole,
    loading,
    isAssessing,
    isCompleting,
    isSubmittingFeedback,
    showRejectionDialog,
    rejectionNote,
    setRejectionNote,
    toggleRejectionDialog,
    handleStatusUpdate,
    handleAssessRequest,
    handleMarkAsComplete,
    handleFeedbackSubmit,
  } = useRequestDetailStore();

  const onStatusUpdate = async (status: "Approved" | "Rejected") => {
    try {
      await handleStatusUpdate(request.id, status, onRequestUpdate);
      toast({
        title: "Success",
        description: `Request ${status.toLowerCase()} successfully`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const onAssessRequest = async () => {
    try {
      await handleAssessRequest(request.id, onRequestUpdate);
      toast({
        title: "Success",
        description: "Request assigned successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const onMarkAsComplete = async () => {
    try {
      await handleMarkAsComplete(request.id, onRequestUpdate);
      toast({
        title: "Success",
        description: "Request marked as complete",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const onSubmitFeedback = async () => {
    try {
      await handleFeedbackSubmit(request.id, onRequestUpdate);
      toast({
        title: "Success",
        description: "Feedback submitted successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-end items-center mt-6 space-x-2">
      {userRole === "admin" && request.status === "For Process" && (
        <Button onClick={onAssessRequest} disabled={isAssessing}>
          {isAssessing ? "Loading..." : "Assign"}
        </Button>
      )}
      {userRole === "head" && request.status === "Pending" && (
        <>
          <Button onClick={() => onStatusUpdate("Approved")} disabled={loading}>
            {loading ? "Loading..." : "Approve"}
          </Button>
          {!showRejectionDialog ? (
            <Button
              variant="destructive"
              onClick={() => toggleRejectionDialog(true)}
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
                  onClick={() => onStatusUpdate("Rejected")}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Confirm Rejection"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    toggleRejectionDialog(false);
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
        <Button onClick={onMarkAsComplete} disabled={isCompleting}>
          {isCompleting ? "Loading..." : "Mark as Complete"}
        </Button>
      )}
      {userRole === "staff" && request.status === "For Feedback" && (
        <Button onClick={onSubmitFeedback} disabled={isSubmittingFeedback}>
          {isSubmittingFeedback ? "Loading..." : "Submit"}
        </Button>
      )}
    </div>
  );
}

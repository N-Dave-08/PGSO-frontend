"use client";

import type React from "react";
import { Request } from "@/types/requests";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useRequestDetailStore } from "@/store/request-detail-store";
import { RequestInfo } from "@/components/request-details/request-info";
import { RequestMedia } from "@/components/request-details/request-media";
import { RequestActions } from "@/components/request-details/request-actions";

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
  const [open, setOpen] = useState(false);
  const { setRequest, fetchUserRole, fetchCategories } =
    useRequestDetailStore();

  // Initialize state with request data when modal opens
  useEffect(() => {
    if (open) {
      setRequest(request);
      fetchUserRole();
      fetchCategories();
    }
  }, [open, request, setRequest, fetchUserRole, fetchCategories]);

  return (
    <Dialog modal={true} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {trigger}
      </DialogTrigger>
      {open && (
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>
              Control No: {request.control_no}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RequestInfo request={request} />
            <RequestMedia request={request} />
          </div>
          <RequestActions
            request={request}
            onRequestUpdate={onRequestUpdate}
            onClose={() => setOpen(false)}
          />
        </DialogContent>
      )}
    </Dialog>
  );
}

"use client";

import { Request } from "@/types";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useRequestDetailStore } from "@/store/request-detail-store";
import { StarRating } from "@/components/request-details/star-rating";

interface RequestMediaProps {
  request: Request;
}

export function RequestMedia({ request }: RequestMediaProps) {
  const {
    userRole,
    setCompletionFile,
    rating,
    hoverRating,
    setRating,
    setHoverRating,
    feedback,
    setFeedback,
  } = useRequestDetailStore();

  return (
    <div className="space-y-4">
      {userRole === "personnel" && request.status === "Queued" && (
        <div className="flex flex-col space-y-1">
          <span className="font-medium text-sm">Completion File:</span>
          <div>
            <Input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setCompletionFile(e.target.files[0]);
                }
              }}
              accept="image/*"
            />
          </div>
        </div>
      )}

      {request.rating !== null && (
        <div className="flex flex-col space-y-1">
          <span className="font-medium text-sm">Rating:</span>
          <StarRating value={request.rating} readonly={true} />
        </div>
      )}

      {request.feedback && (
        <div className="flex flex-col space-y-1">
          <span className="font-medium text-sm">Feedback:</span>
          <span>{request.feedback}</span>
        </div>
      )}

      {userRole === "staff" && request.status === "For Feedback" && (
        <>
          <div className="flex flex-col space-y-1">
            <span className="font-medium text-sm">Rating:</span>
            <StarRating
              value={rating}
              hover={hoverRating}
              onChange={setRating}
              onHoverChange={setHoverRating}
            />
          </div>
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
        </>
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
  );
}

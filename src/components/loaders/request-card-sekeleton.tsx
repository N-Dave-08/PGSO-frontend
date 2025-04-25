import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function RequestCardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-3/4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <Skeleton className="h-4 w-3/4 mb-1" />
            <Skeleton className="h-4 w-full mb-3" />
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

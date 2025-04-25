import React from "react";

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  className = "flex items-center justify-center h-full",
}: LoadingStateProps) {
  return (
    <div className={className}>
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

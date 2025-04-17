import React from "react";

interface NotFoundStateProps {
  message?: string;
  className?: string;
}

export function NotFoundState({
  message = "Not found",
  className = "flex items-center justify-center h-full",
}: NotFoundStateProps) {
  return (
    <div className={className}>
      <div className="flex flex-col items-center gap-2">
        <div className="bg-muted h-16 w-16 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}

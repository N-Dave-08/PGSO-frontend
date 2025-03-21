import React from "react"
import { cn } from "@/lib/utils"

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "small" | "medium" | "large"
  color?: string
}

export function Loader({
  size = "medium",
  color = "currentColor",
  className,
  ...props
}: LoaderProps) {
  return (
    <div
      className={cn("flex items-center justify-center h-screen space-x-2", className)}
      role="status"
      {...props}
    >
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            "animate-bounce rounded-full",
            {
              "h-2 w-2": size === "small",
              "h-3 w-3": size === "medium",
              "h-4 w-4": size === "large",
            }
          )}
          style={{
            backgroundColor: color,
            animationDelay: `${index * 0.1}s`,
          }}
        ></div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  )
}
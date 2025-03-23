"use client";

import { Button } from "@/components/ui/button";
import { WifiOff, Loader2 } from "lucide-react";
import { useState } from "react";

export default function OfflinePage() {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    // Check connection and navigate back if online
    setTimeout(() => {
      if (navigator.onLine) {
        window.location.href = "/";
      } else {
        setIsRetrying(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <WifiOff className="w-16 h-16 mb-6 text-red-500" />
      <h1 className="text-2xl font-bold mb-2">You&apos;re Offline</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        The app requires an internet connection to function properly. Please
        check your connection and try again.
      </p>
      <Button onClick={handleRetry} disabled={isRetrying} className="min-w-40">
        {isRetrying ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking connection...
          </>
        ) : (
          "Try Again"
        )}
      </Button>
    </div>
  );
}

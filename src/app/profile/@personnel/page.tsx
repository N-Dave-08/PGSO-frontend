"use client";

import React from "react";
import { ProfileForm } from "@/components/forms/profile-form";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { updateUserProfile } from "@/lib/profile/profile-service";
import { LoadingState } from "@/components/ui/loading-state";
import { NotFoundState } from "@/components/ui/not-found-state";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function PersonnelProfilePage() {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  const handleSaveProfile = async (values: any) => {
    try {
      await updateUserProfile(values, updateUser);
      return Promise.resolve();
    } catch (error: any) {
      // Let the form component handle the specific error
      return Promise.reject(error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <NotFoundState message="User not found" />;
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <ProfileForm user={user} onSave={handleSaveProfile} />
    </div>
  );
}

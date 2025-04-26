"use client";

import React from "react";
import { useCallback, useEffect, useState } from "react";
import { AccomplishmentTable } from "@/components/tables/accomplishment/accomplishment-table";
import { AccomplishmentService } from "@/lib/api/services/accomplishment-service";
import { Accomplishment } from "@/types";
import { toast } from "sonner";
import { DataTableSkeleton } from "@/components/loaders/data-table-skeleton";

export default function AccomplishmentPage() {
  const [accomplishments, setAccomplishments] = useState<Accomplishment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccomplishments = useCallback(async () => {
    try {
      const service = new AccomplishmentService();
      const response = await service.getAccomplishments();
      if (response.isSuccess) {
        setAccomplishments(response.data);
      } else {
        toast.error(response.message || "Failed to fetch accomplishments");
      }
    } catch (error) {
      toast.error("An error occurred while fetching accomplishments");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccomplishments();
  }, [fetchAccomplishments]);

  if (isLoading) {
    return <DataTableSkeleton />;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Accomplishments</h1>
      </div>
      <AccomplishmentTable
        data={accomplishments}
        onFilterChange={(filters) => {
          console.log("Filters changed:", filters);
          // Implement filter logic here
        }}
      />
    </div>
  );
}

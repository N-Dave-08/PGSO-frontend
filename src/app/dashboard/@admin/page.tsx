"use client";

import { useEffect, useState } from "react";
import { RequestCategoryCards } from "@/components/cards/request-category-cards";
import { RequestStatusCards } from "@/components/cards/request-status-cards";
import { ManpowerCategoryCards } from "@/components/cards/manpower-category-cards";
import { DashboardOverview } from "@/components/cards/dashboard-overview";
import { DashboardCharts } from "@/components/charts/dashboard-charts";
import { apiServices } from "@/lib/api/services";
import { toast } from "sonner";
import {
  DashboardCategoryData,
  RequestsByStatus,
  MonthlyRequests,
  ManpowerStat,
} from "@/types";

export default function Page() {
  const [categories, setCategories] = useState<DashboardCategoryData[]>([]);
  const [statusData, setStatusData] = useState<RequestsByStatus>({});
  const [monthlyData, setMonthlyData] = useState<MonthlyRequests>({});
  const [manpowerStats, setManpowerStats] = useState<ManpowerStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const summary = await apiServices.dashboard.getDashboardSummary();

        if (summary.isSuccess) {
          setCategories(summary.total_requests_by_category);
          setStatusData(summary.total_requests_by_status);
          setMonthlyData(summary.monthly_requests);
          setManpowerStats(summary.manpower_stats);
        } else {
          toast.error("Failed to fetch dashboard data");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate summary statistics
  const totalRequests = categories.reduce(
    (sum, cat) => sum + cat.requests_count,
    0
  );
  const totalManpower = manpowerStats.reduce(
    (sum, stat) => sum + stat.manpower_count,
    0
  );
  const monthlyRequestsCount = Object.values(monthlyData)[0] || 0;
  const completedRequests = statusData["Completed"] || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <DashboardOverview
            totalRequests={totalRequests}
            totalManpower={totalManpower}
            monthlyRequests={monthlyRequestsCount}
            completedRequests={completedRequests}
          />

          <DashboardCharts
            categories={categories}
            manpowerStats={manpowerStats}
            statusData={statusData}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Requests by Status</h2>
              <RequestStatusCards statusData={statusData} />
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Manpower by Category</h2>
              <ManpowerCategoryCards manpowerStats={manpowerStats} />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Requests by Category</h2>
            <RequestCategoryCards categories={categories} />
          </div>
        </div>
      )}
    </div>
  );
}

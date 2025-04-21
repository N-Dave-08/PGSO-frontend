"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { MonthlyRequests } from "@/types";

interface MonthlyRequestsCardProps {
  monthlyData: MonthlyRequests;
}

export function MonthlyRequestsCard({ monthlyData }: MonthlyRequestsCardProps) {
  const currentMonth = Object.entries(monthlyData)[0] || ["", 0];
  const [month, count] = currentMonth;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Monthly Requests</CardTitle>
        <CalendarDays className="h-4 w-4 text-blue-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">Requests in {month}</p>
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, CalendarDays, CheckCircle } from "lucide-react";

interface DashboardOverviewProps {
  totalRequests: number;
  totalManpower: number;
  monthlyRequests: number;
  completedRequests: number;
}

export function DashboardOverview({
  totalRequests,
  totalManpower,
  monthlyRequests,
  completedRequests,
}: DashboardOverviewProps) {
  const overviewCards = [
    {
      title: "Total Requests",
      value: totalRequests,
      icon: <FileText className="h-4 w-4 text-blue-600" />,
      description: "All time requests",
    },
    {
      title: "Total Manpower",
      value: totalManpower,
      icon: <Users className="h-4 w-4 text-green-600" />,
      description: "Available personnel",
    },
    {
      title: "Monthly Requests",
      value: monthlyRequests,
      icon: <CalendarDays className="h-4 w-4 text-yellow-600" />,
      description: "This month",
    },
    {
      title: "Completed Requests",
      value: completedRequests,
      icon: <CheckCircle className="h-4 w-4 text-purple-600" />,
      description: "Successfully resolved",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {overviewCards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

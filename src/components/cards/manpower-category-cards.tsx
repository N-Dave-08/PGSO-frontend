"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Wrench, Hammer } from "lucide-react";
import { ManpowerStat } from "@/types";

interface ManpowerCategoryCardsProps {
  manpowerStats: ManpowerStat[];
}

const getCategoryIcon = (categoryName: string) => {
  switch (categoryName.toLowerCase()) {
    case "electrical":
      return <Users className="h-4 w-4" />;
    case "masonry":
      return <Building2 className="h-4 w-4" />;
    case "plumbing":
      return <Wrench className="h-4 w-4" />;
    case "carpentry":
      return <Hammer className="h-4 w-4" />;
    default:
      return <Users className="h-4 w-4" />;
  }
};

export function ManpowerCategoryCards({
  manpowerStats,
}: ManpowerCategoryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {manpowerStats.map((stat) => (
        <Card key={stat.category_name}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.category_name}
            </CardTitle>
            {getCategoryIcon(stat.category_name)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.manpower_count}</div>
            <p className="text-xs text-muted-foreground">Personnel assigned</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

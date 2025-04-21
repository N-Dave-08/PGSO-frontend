"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Building2, Wrench, Hammer } from "lucide-react";
import { DashboardCategoryData } from "@/types";

interface RequestCategoryCardsProps {
  categories: DashboardCategoryData[];
}

const getCategoryIcon = (categoryName: string) => {
  switch (categoryName.toLowerCase()) {
    case "electrical":
      return <Zap className="h-4 w-4" />;
    case "masonry":
      return <Building2 className="h-4 w-4" />;
    case "plumbing":
      return <Wrench className="h-4 w-4" />;
    case "carpentry":
      return <Hammer className="h-4 w-4" />;
    default:
      return <Wrench className="h-4 w-4" />;
  }
};

export function RequestCategoryCards({
  categories,
}: RequestCategoryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {category.category_name}
            </CardTitle>
            {getCategoryIcon(category.category_name)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{category.requests_count}</div>
            <p className="text-xs text-muted-foreground">
              {category.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

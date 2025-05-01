import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { routesData } from "@/helpers/routes";

interface NavOperationsProps {
  allowedRoutes: string[];
}

export function NavOperations({ allowedRoutes }: NavOperationsProps) {
  const path = usePathname();
  const operationsRoutes = [
    "REQUESTS",
    "TASKS",
    "CALENDAR",
    "REPORTS",
    "ACCOMPLISHMENT",
  ];

  const filteredRoutes = operationsRoutes.filter((route) =>
    allowedRoutes.includes(route)
  );

  if (!filteredRoutes.length) return null;

  return (
    <>
      <div className="px-3 py-2">
        <h3 className="text-xs font-semibold text-muted-foreground">
          Operations
        </h3>
      </div>
      <SidebarMenu>
        {filteredRoutes.map((key) => {
          const route = routesData[key];
          return (
            <SidebarMenuItem key={key}>
              <SidebarMenuButton
                asChild
                isActive={path === `${route.link}/`}
                className="text-base-content/70"
              >
                <Link href={route.link}>
                  {route.icon}
                  {route.name}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </>
  );
}

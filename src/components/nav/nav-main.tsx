import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { routesData } from "@/helpers/routes";

interface NavMainProps {
  allowedRoutes: string[];
}

export function NavMain({ allowedRoutes }: NavMainProps) {
  const path = usePathname();
  const mainRoutes = ["DASHBOARD", "PROFILE"];

  const filteredRoutes = mainRoutes.filter((route) =>
    allowedRoutes.includes(route)
  );

  if (!filteredRoutes.length) return null;

  return (
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
  );
}

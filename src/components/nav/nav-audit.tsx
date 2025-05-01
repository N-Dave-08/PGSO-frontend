import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { routesData } from "@/helpers/routes";

interface NavAuditProps {
  allowedRoutes: string[];
}

export function NavAudit({ allowedRoutes }: NavAuditProps) {
  const path = usePathname();
  const auditRoutes = ["AUDIT_LOGS"];

  const filteredRoutes = auditRoutes.filter((route) =>
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

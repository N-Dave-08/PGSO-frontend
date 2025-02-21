"use client";

import React, { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { routesData } from "@/helpers/routes";
import { NavUser } from "@/components/navbars/nav-user";
import Link from "next/link";

export default function UserSidebar() {
  const path = usePathname();
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    setRole(role || "");
  }, []);

  const filteredRoutes = React.useMemo(() => {
    const adminRoutes = [
      "DASHBOARD",
      "USERS",
      "REQUESTS",
      "CATEGORIES",
      "DEPARTMENTS",
      "DIVISIONS",
      "AUDIT_LOGS",
      "SETTINGS",
    ];
    const personnelRoutes = [
      "DASHBOARD",
      "PROFILE",
      "TASKS",
      "CALENDAR",
      "FEEDBACK",
      "SETTINGS",
    ];
    const headRoutes = [
      "DASHBOARD",
      "REQUESTS",
      "DEPARTMENTS",
      "DIVISIONS",
      "STAFFS",
      "SETTINGS",
      "PROFILE",
    ];
    const staffRoutes = ["DASHBOARD", "REQUESTS", "PROFILE", "SETTINGS"];

    return Object.entries(routesData).filter(([key]) => {
      switch (role) {
        case "personnel":
          return personnelRoutes.includes(key);
        case "head":
          return headRoutes.includes(key);
        case "staff":
          return staffRoutes.includes(key);
        case "admin":
          return adminRoutes.includes(key);
        default:
          return true;
      }
    });
  }, [role]);

  return (
    <Sidebar variant={"sidebar"} className="w-[16rem]">
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredRoutes.map(([key, route]) => (
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
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

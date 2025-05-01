"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { LoginUser } from "@/types/auth";
import { secureStorage } from "@/lib/utils/encryption";
import { NavMain } from "@/components/nav/nav-main";
import { NavManagement } from "@/components/nav/nav-management";
import { NavOperations } from "@/components/nav/nav-operations";
import { NavFeedback } from "@/components/nav/nav-feedback";
import { NavAudit } from "@/components/nav/nav-audit";
import { NavUser } from "@/components/nav/nav-user";
import { ArrowUpCircleIcon } from "lucide-react";
import Image from "next/image";

export default function UserSidebar() {
  const router = useRouter();
  const [role, setRole] = useState<string>("");
  const [user, setUser] = useState<LoginUser | null>(null);
  const [allowedRoutes, setAllowedRoutes] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedRole = await secureStorage.get("role");
        const userData = await secureStorage.get("user");

        if (userData && storedRole) {
          setUser(userData);
          setRole(storedRole);
          setAllowedRoutes(getAllowedRoutes(storedRole));
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.push("/");
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await secureStorage.remove("token");
      await secureStorage.remove("user");
      await secureStorage.remove("sessionCode");
      await secureStorage.remove("role");

      window.dispatchEvent(new Event("authChange"));
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
      router.push("/");
    }
  };

  const getAllowedRoutes = (userRole: string): string[] => {
    const adminRoutes = [
      "DASHBOARD",
      "USERS",
      "REQUESTS",
      "CATEGORIES",
      "DEPARTMENTS",
      "DIVISIONS",
      "AUDIT_LOGS",
      "REPORTS",
    ];
    const personnelRoutes = [
      "PROFILE",
      "TASKS",
      "CALENDAR",
      "FEEDBACK",
      "ACCOMPLISHMENT",
    ];
    const headRoutes = [
      "REQUESTS",
      "DIVISIONS",
      "STAFFS",
      "PROFILE",
      "REPORTS",
    ];
    const staffRoutes = ["REQUESTS", "PROFILE"];

    switch (userRole) {
      case "personnel":
        return personnelRoutes;
      case "head":
        return headRoutes;
      case "staff":
        return staffRoutes;
      case "admin":
        return adminRoutes;
      default:
        return [];
    }
  };

  return (
    <Sidebar
      variant={"sidebar"}
      className="hidden md:flex md:flex-col w-[16rem]"
    >
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex items-center gap-2 p-1">
            <div className="relative size-8">
              <Image src="/images/bulacan.png" alt="PGSO" fill />
            </div>
            <span className="text-base font-semibold">PGSO</span>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <NavMain allowedRoutes={allowedRoutes} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <NavManagement allowedRoutes={allowedRoutes} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <NavOperations allowedRoutes={allowedRoutes} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <NavFeedback allowedRoutes={allowedRoutes} />
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto pt-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <NavAudit allowedRoutes={allowedRoutes} />
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} role={role} onLogout={handleLogout} />
      </SidebarFooter>
    </Sidebar>
  );
}

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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LoginUser } from "@/types/auth";
import { secureStorage } from "@/lib/utils/encryption";
import { NavMain } from "@/components/nav/nav-main";
import { NavManagement } from "@/components/nav/nav-management";
import { NavOperations } from "@/components/nav/nav-operations";
import { NavUser } from "@/components/nav/nav-user";
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
      "REPORTS",
    ];
    const personnelRoutes = ["PROFILE", "TASKS", "ACCOMPLISHMENT"];
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
    <>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="fixed inset-y-0 z-50 h-full w-[16rem] transition-all duration-300 ease-in-out data-[collapsed=true]:w-[4rem]"
      >
        <SidebarHeader>
          <SidebarMenu>
            <div className="flex items-center gap-2 p-1">
              <div className="relative size-5">
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
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={user} role={role} onLogout={handleLogout} />
        </SidebarFooter>
      </Sidebar>
      <SidebarTrigger className="fixed left-4 top-4 z-50 md:hidden" />
    </>
  );
}

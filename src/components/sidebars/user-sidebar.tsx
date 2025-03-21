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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { routesData } from "@/helpers/routes";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoginUser } from "@/types/auth";
import Link from "next/link";
import { secureStorage } from "@/lib/utils/encryption";

export default function UserSidebar() {
  const path = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string>("");
  const [user, setUser] = useState<LoginUser | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get role from localStorage for compatibility
        const role = localStorage.getItem("role");
        setRole(role || "");

        // Get user data from secure storage
        const userData = await secureStorage.get("user");
        if (userData) {
          setUser(userData);
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
    // Use the secureStorage to remove items
    await secureStorage.remove("token");
    await secureStorage.remove("user");
    await secureStorage.remove("sessionCode");
    localStorage.removeItem("role");

    window.dispatchEvent(new Event("authChange"));
    router.push("/");
  };

  // Define route categories
  const routeCategories = {
    main: ["DASHBOARD", "PROFILE"],
    management: ["USERS", "STAFFS", "DEPARTMENTS", "DIVISIONS", "CATEGORIES"],
    operations: ["REQUESTS", "TASKS", "CALENDAR"],
    feedback: ["FEEDBACK", "AUDIT_LOGS"],
    settings: ["SETTINGS"],
  };

  // Define allowed routes by role
  const allowedRoutesByRole = React.useMemo(() => {
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

    switch (role) {
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
  }, [role]);

  // Group routes by category - use a ref for routeCategories to avoid dependency issues
  const routeCategoriesRef = React.useRef(routeCategories);

  // Group routes by category
  const groupedRoutes = React.useMemo(() => {
    const result: Record<
      string,
      [string, (typeof routesData)[keyof typeof routesData]][]
    > = {};

    Object.keys(routeCategoriesRef.current).forEach((category) => {
      result[category] = Object.entries(routesData)
        .filter(
          ([key]) =>
            routeCategoriesRef.current[
              category as keyof typeof routeCategories
            ].includes(key) && allowedRoutesByRole.includes(key)
        )
        .sort((a, b) => {
          // Sort by the order in the category array
          const categoryArray =
            routeCategoriesRef.current[
              category as keyof typeof routeCategories
            ];
          return categoryArray.indexOf(a[0]) - categoryArray.indexOf(b[0]);
        });
    });

    return result;
  }, [allowedRoutesByRole]);

  return (
    <Sidebar variant={"sidebar"} className="hidden md:block w-[16rem]">
      <SidebarHeader className="border-b border-sidebar-border pb-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="h-10 w-10 rounded-lg">
            <AvatarImage
              src={
                user?.profile
                  ? `${
                      process.env.NEXT_PUBLIC_API_BASE_URL
                    }/${user.profile.replace(/\\/g, "")}`
                  : ""
              }
              alt={user?.name || "User"}
            />
            <AvatarFallback className="rounded-lg">
              {user ? user.name[0] : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="flex gap-1 truncate">
              <p className="font-semibold truncate">
                {user ? user.name : "Loading..."}
              </p>
              <p className="opacity-50 font-light text-xs">({role})</p>
            </span>
            <span className="truncate text-xs">
              {user ? user.email : "Loading..."}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {groupedRoutes.main?.map(([key, route]) => (
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

        {/* Management Section */}
        {groupedRoutes.management?.length > 0 && (
          <SidebarGroup>
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-muted-foreground">
                Management
              </h3>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {groupedRoutes.management.map(([key, route]) => (
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
        )}

        {/* Operations Section */}
        {groupedRoutes.operations?.length > 0 && (
          <SidebarGroup>
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-muted-foreground">
                Operations
              </h3>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {groupedRoutes.operations.map(([key, route]) => (
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
        )}

        {/* Feedback Section */}
        {groupedRoutes.feedback?.length > 0 && (
          <SidebarGroup>
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-muted-foreground">
                Feedback
              </h3>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {groupedRoutes.feedback.map(([key, route]) => (
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
        )}

        {/* Settings Section */}
        {groupedRoutes.settings?.length > 0 && (
          <SidebarGroup>
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-muted-foreground">
                Settings
              </h3>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {groupedRoutes.settings.map(([key, route]) => (
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
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="text-base-content/70"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}

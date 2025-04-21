"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Building2,
  Network,
  FileText,
  Settings,
  ChartBarStacked,
  ListTodo,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LoginUser } from "@/types/auth";
import { secureStorage } from "@/lib/utils/encryption";

import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const NavLink = ({ item, isActive }: { item: NavItem; isActive: boolean }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          className={cn(
            "flex items-center justify-center rounded-md p-2",
            isActive ? "text-primary" : "text-muted-foreground"
          )}
        >
          <item.icon className="h-5 w-5" />
          <span className="sr-only">{item.name}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top" align="center">
        <p>{item.name}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export function MobileNav() {
  const pathname = usePathname();
  const [user, setUser] = React.useState<LoginUser | null>(null);
  const [role, setRole] = React.useState<string>("");

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedRole = await secureStorage.get("role");
        const userData = await secureStorage.get("user");

        if (userData && storedRole) {
          setUser(userData);
          setRole(storedRole);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const getNavItems = () => {
    // Bottom navigation items based on role
    const bottomNavItems: Record<string, NavItem[]> = {
      admin: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Departments", href: "/departments", icon: Building2 },
        { name: "Divisions", href: "/divisions", icon: Network },
        { name: "Categories", href: "/categories", icon: ChartBarStacked },
        { name: "Requests", href: "/requests", icon: ClipboardList },
        { name: "Audit Logs", href: "/audits", icon: FileText },
      ],
      head: [
        { name: "Departments", href: "/departments", icon: Building2 },
        { name: "Divisions", href: "/divisions", icon: Network },
        { name: "Requests", href: "/requests", icon: ClipboardList },
      ],
      personnel: [
        { name: "Tasks", href: "/tasks", icon: ListTodo },
        { name: "Calendar", href: "/calendar", icon: Calendar },
        { name: "Feedback", href: "/feedback", icon: MessageSquare },
      ],
      staff: [{ name: "Requests", href: "/requests", icon: ClipboardList }],
    };

    // Top navigation items based on role
    const topNavItems: Record<string, NavItem[]> = {
      admin: [
        { name: "Users", href: "/users", icon: Users },
        { name: "Staffs", href: "/staffs", icon: Users },
        { name: "Settings", href: "/settings", icon: Settings },
      ],
      head: [
        { name: "Staffs", href: "/staffs", icon: Users },
        { name: "Settings", href: "/settings", icon: Settings },
      ],
      personnel: [{ name: "Settings", href: "/settings", icon: Settings }],
      staff: [{ name: "Settings", href: "/settings", icon: Settings }],
    };

    return {
      bottomNavItems: bottomNavItems[role] || [],
      topNavItems: topNavItems[role] || [],
    };
  };

  const { bottomNavItems, topNavItems } = getNavItems();

  return (
    <TooltipProvider>
      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 z-40 h-16 w-full border-b bg-background px-4 md:hidden">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center gap-2">
            {topNavItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <NavLink key={item.name} item={item} isActive={isActive} />
              );
            })}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/profile"
                className={cn(
                  "flex items-center justify-center",
                  pathname.startsWith("/profile")
                    ? "ring-2 ring-primary rounded-full"
                    : ""
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      user?.profile
                        ? `${
                            process.env.NEXT_PUBLIC_API_BASE_URL
                          }/${user.profile.replace(/\\/g, "")}`
                        : ""
                    }
                    alt={user?.first_name + " " + user?.last_name || "User"}
                  />
                  <AvatarFallback>
                    {user ? user.first_name[0] + user.last_name[0] : "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end">
              <p>Profile</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 z-40 h-16 w-full border-t bg-background md:hidden">
        <div className="mx-auto flex h-full items-center justify-around px-4">
          {bottomNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return <NavLink key={item.name} item={item} isActive={isActive} />;
          })}
        </div>
      </nav>

      {/* Content Padding */}
      <div className="pb-16 pt-16 md:pb-0 md:pt-0" />
    </TooltipProvider>
  );
}

export default MobileNav;

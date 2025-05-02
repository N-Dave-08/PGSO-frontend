"use client";

import { LogOut, MoreVerticalIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { LoginUser } from "@/types/auth";

interface NavUserProps {
  user: LoginUser | null;
  role: string;
  onLogout: () => void;
}

export function NavUser({ user, role, onLogout }: NavUserProps) {
  const { isMobile } = useSidebar();

  if (!user) return null;

  const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
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
                <AvatarFallback className="rounded-lg">
                  {user.first_name[0] + user.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user.first_name + " " + user.last_name}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {capitalizedRole}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
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
                  <AvatarFallback className="rounded-lg">
                    {user.first_name[0] + user.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.first_name + " " + user.last_name}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="truncate text-muted-foreground">
                      {user.email}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                    <span className="text-xs font-medium text-muted-foreground/80">
                      {capitalizedRole}
                    </span>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

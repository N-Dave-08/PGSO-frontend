import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  SearchIcon,
  PlusIcon,
  PlayIcon,
  UserIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const MobileNav = () => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: HomeIcon,
    },
    {
      name: "Search",
      href: "/search",
      icon: SearchIcon,
    },
    {
      name: "Create",
      href: "/create",
      icon: PlusIcon,
    },
    {
      name: "Activity",
      href: "/activity",
      icon: PlayIcon,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: UserIcon,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 h-16 w-full border-t bg-background md:hidden">
      <div className="mx-auto flex h-full max-w-md items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="sr-only">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;

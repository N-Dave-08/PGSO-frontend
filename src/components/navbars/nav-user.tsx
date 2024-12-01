"use client"

import {
    User,
    LogOut,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { setupImage } from "@/helpers/setup"
import { logout } from "@/actions/auth"
import { useRouter } from "next/navigation"

export function NavUser() {
    const { isMobile } = useSidebar()
    const router = useRouter()
    const handleLogout = () => {
        logout()
        router.push('/')
      }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-white/10 data-[state=open]:text-base-content"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={`${setupImage}images/morty.png`} alt="user" />
                                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">John Doe</span>
                                <span className="truncate text-xs">johndoe@gmail.com</span>
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-40 rounded-lg bg-neutral text-base-content border-none"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={10}
                    >
                        <DropdownMenuItem className="focus:text-base-content focus:bg-white/10">
                            <User />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:text-base-content focus:bg-white/10" onClick={handleLogout}>
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

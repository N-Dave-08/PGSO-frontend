"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import {
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

interface UserType {
    id: number
    email: string
}

export function NavUser() {

    const { isMobile } = useSidebar()
    const router = useRouter()
    const [user, setUser] = useState<UserType | null>(null)
    const [role, setRole] = useState<string | null>(null)

    useEffect(() => {
        setRole(localStorage.getItem('role'))
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        } else {
          router.push('/')
        }
      }, [router])

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
                                <AvatarImage alt="user" />
                                <AvatarFallback className="rounded-lg">JD</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="flex gap-1 truncate">
                                    <p className='font-semibold truncate'>John Doe</p>
                                    <p className='opacity-50 font-light text-xs'>({role})</p>
                                </span>
                                <span className="truncate text-xs">{user ? user.email : 'Loading...'}</span>
                            </div>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-40 rounded-lg bg-neutral text-base-content border-none"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={10}
                    >
                        <DropdownMenuItem 
                        className="focus:text-base-content focus:bg-white/10"
                        onClick={() => {
                            localStorage.removeItem('token')
                            localStorage.removeItem('user')
                            router.push('/')
                        }}
                        >
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

"use client"

import React from 'react'
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'
import { routesData } from '@/helpers/routes'
import { NavUser } from '@/components/navbars/nav-user'
import { logout } from '@/actions/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminSidebar() {

  const path = usePathname()
  const router = useRouter()
  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.entries(routesData).map(([key, route]) => (
                <SidebarMenuItem key={key}>
                  <SidebarMenuButton
                    asChild
                    isActive={path === route.link}
                    className='text-base-content/70'
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              Log out
            </SidebarMenuButton>  
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

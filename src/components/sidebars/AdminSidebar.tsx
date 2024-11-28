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
} from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'
import { routesData } from '@/helpers/routes'
import { NavUser } from '@/components/navbars/nav-user'
import Link from 'next/link'

export default function AdminSidebar() {

  const path = usePathname();

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
    </Sidebar>
  )
}

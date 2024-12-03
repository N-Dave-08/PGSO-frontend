"use client"

import React, { useState, useEffect } from 'react'
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
import { Button } from '@/components/ui/button'
import { LogOut, Loader2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { routesData } from '@/helpers/routes'
import { NavUser } from '@/components/navbars/nav-user'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function UserSidebar() {

  const path = usePathname()
  const [role, setRole] = useState<string>('')
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogout = async () => {
    setIsLoading(true) 
    setError('')
    try {
      const response = await fetch('https://server.pgso.bpc-bsis4d.com/public/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Logout failed')
      }
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('user')
      window.dispatchEvent(new Event('authChange'))
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Logout error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const role = localStorage.getItem('role')
    setRole(role || '')
  }, [])

  const filteredRoutes = React.useMemo(() => {
    const adminRoutes = ['DASHBOARD', 'USERS', 'REQUESTS', 'CATEGORIES', 'DEPARTMENTS', 'DIVISIONS', 'AUDIT_LOGS', 'SETTINGS']
    const personnelRoutes = ['DASHBOARD', 'PROFILE', 'TASKS', 'CALENDAR', 'FEEDBACK', 'SETTINGS']
    const headRoutes = ['DASHBOARD', 'REQUESTS', 'DEPARTMENTS', 'DIVISIONS', 'STAFFS', 'SETTINGS', 'PROFILE']
    const staffRoutes = ['DASHBOARD', 'REQUESTS', 'PROFILE', 'SETTINGS']

    return Object.entries(routesData).filter(([key]) => {
      switch (role) {
        case 'personnel':
          return personnelRoutes.includes(key)
        case 'head':
          return headRoutes.includes(key)
        case 'staff':
          return staffRoutes.includes(key)
        case 'admin':
          return adminRoutes.includes(key)
        default:
          return true
      }
    })
  }, [role])

  return (
    <Sidebar>
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        {error && (
          <div className="px-4 py-2 text-red-500 text-sm">
            {error}
          </div>
        )}
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredRoutes.map(([key, route]) => (
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
        {
          !isLoading ? (
            <Button variant='ghost' onClick={handleLogout}>
              <LogOut />
              Log out
            </Button>
          ) : (
            <Button disabled>
              <Loader2 className="animate-spin" />
              Please wait
            </Button>
          )
        }
      </SidebarFooter>
    </Sidebar>
  )
}

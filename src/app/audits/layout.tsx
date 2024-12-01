'use client'

import React, { useEffect, useState } from 'react'
import { getSession } from '@/actions/auth'
import { SidebarProvider } from '@/components/ui/sidebar'
import AdminSidebar from '@/components/sidebars/AdminSidebar'

function checkUserRole(role: 'head' | 'admin' | 'staff' | 'personnel'): string {
    return role
}

type Role = 'head' | 'admin' | 'staff' | 'personnel' | null

export default function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const [role, setRole] = useState<Role>(null)

    useEffect(() => {
        const fetchSession = async () => {
            const session = await getSession()
            if (session) {
                const userRole = checkUserRole(session.role);
                setRole(userRole as Role);
            }
        }
        fetchSession()
    }, [])

    return (
        <SidebarProvider>
            <AdminSidebar />
            <main className='p-4 flex flex-col w-full'>
                {children}
            </main>
        </SidebarProvider>
    )
}


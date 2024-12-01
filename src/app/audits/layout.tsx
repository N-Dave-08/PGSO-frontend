'use client'

import React, { useEffect, useState } from 'react'
import { getSession } from '@/actions/auth'
import { SidebarProvider } from '@/components/ui/sidebar'
import AdminSidebar from '@/components/sidebars/AdminSidebar'

function checkUserRole(role: 'head' | 'admin' | 'staff' | 'personnel'): string {
    return role
}

interface LayoutProps {
    head: React.ReactNode
    admin: React.ReactNode
    staff: React.ReactNode
    personnel: React.ReactNode
}

export default function Layout({
    head,
    admin,
    staff,
    personnel
}: LayoutProps) {
    const [role, setRole] = useState<'head' | 'admin' | 'staff' | 'personnel' | null>(null)

    useEffect(() => {
        const fetchSession = async () => {
            const session = await getSession()
            if (session) {
                const userRole = checkUserRole(session.role);
                setRole(
                    userRole === 'head' ||
                        userRole === 'admin' ||
                        userRole === 'staff' ||
                        userRole === 'personnel' ? userRole : null
                );
            }
        }
        fetchSession()
    }, [])

    const roleComponents = {
        head: head,
        admin: admin,
        staff: staff,
        personnel: personnel,
    };

    return (
        <SidebarProvider>
            <AdminSidebar />
            <main className='p-4 flex flex-col w-full'>
                {role ? roleComponents[role] : null}
            </main>
        </SidebarProvider>
    )
}

'use client'

import React, { useEffect, useState } from 'react'
import { getSession } from '@/actions/auth'
import { SidebarProvider } from '@/components/ui/sidebar'
import AdminSidebar from '@/components/sidebars/AdminSidebar'

function checkUserRole(role) {
    return role
}

export default function Layout({
    head,
    admin,
    staff,
    personnel
}) {
    const [role, setRole] = useState(null)

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

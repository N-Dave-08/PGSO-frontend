'use client'

import React, { useEffect, useState } from 'react'
import { getSession } from '@/actions/auth'
import { SidebarProvider } from '@/components/ui/sidebar'
import AdminSidebar from '@/components/sidebars/AdminSidebar'

interface LayoutProps {
    head?: React.ReactNode
    admin?: React.ReactNode
    staff?: React.ReactNode
    personnel?: React.ReactNode
}

export default function Layout({
    head = null,
    admin = null,
    staff = null,
    personnel = null
}: LayoutProps) {
    const [role, setRole] = useState<'head' | 'admin' | 'staff' | 'personnel' | null>(null);

    useEffect(() => {
        const fetchSession = async () => {
            const session = await getSession();
            setRole(session?.role ?? null);
        };
        fetchSession();
    }, []);

    const roleComponents: LayoutProps = { head, admin, staff, personnel };

    return (
        <SidebarProvider>
            <AdminSidebar />
            <main className="p-4 flex flex-col w-full">
                {role ? roleComponents[role] : null}
            </main>
        </SidebarProvider>
    );
}


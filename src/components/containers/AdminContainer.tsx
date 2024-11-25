import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import AdminSidebar from '@/components/sidebars/AdminSidebar'

interface AdminContainerProps { 
    children: React.ReactNode; 
}

export default function AdminContainer({ children }: AdminContainerProps) {
    return (
        <SidebarProvider>
            <AdminSidebar />
            <main className='p-4 flex flex-col'>
                {children}
            </main>
        </SidebarProvider>
    )
}

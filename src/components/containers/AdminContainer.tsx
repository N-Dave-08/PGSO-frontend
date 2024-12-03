import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import UserSidebar from '@/components/sidebars/UserSidebar'

interface AdminContainerProps { 
    children: React.ReactNode; 
}

export default function AdminContainer({ children }: AdminContainerProps) {
    return (
        <SidebarProvider>
            <UserSidebar />
            <main className='p-4 flex flex-col w-full'>
                {children}
            </main>
        </SidebarProvider>
    )
}

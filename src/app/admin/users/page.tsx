import React from 'react'
import AdminContainer from '@/components/containers/AdminContainer'
import { UserTable } from '@/components/tables/user-table'

export default function page() {
    return (
        <AdminContainer>
            <UserTable />
        </AdminContainer>
    )
}

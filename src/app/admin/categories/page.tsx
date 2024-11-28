import React from 'react'
import AdminContainer from '@/components/containers/AdminContainer'
import { CategoryTable } from '@/components/tables/category-table'

export default function page() {
    return (
        <AdminContainer>
            <CategoryTable />
        </AdminContainer>
    )
}

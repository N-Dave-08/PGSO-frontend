import React from 'react'
import AdminContainer from '@/components/containers/AdminContainer'
import { DepartmentTable } from '@/components/tables/department-table'

export default function page() {
  return (
    <AdminContainer>
      <DepartmentTable />
    </AdminContainer>
  )
}

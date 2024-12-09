'use client'

import React from 'react'
import { RequestTable } from '@/components/tables/request-table'
import { RequestModal } from '@/components/modals/request-modal'

export default function page() {
  return (
    <div>
      <RequestModal />
      <RequestTable />
    </div>
  )
}

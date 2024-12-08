'use client'

import React, { useEffect, useState } from 'react'
import { UserTable } from '@/components/tables/user-table'
import { getUsers } from '@/lib/api/users'

interface ApiUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_name: string;
  department_name: string;
  division_name: string;
  is_archived: number;
}
interface TableUser {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  division: string;
  status: string;
}

export default function Page() {
  const [users, setUsers] = useState<TableUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers()
        const usersData = response.user || []
        const formattedData = usersData.map((user: ApiUser): TableUser => ({
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: user.role_name,
          department: user.department_name,
          division: user.division_name,
          status: user.is_archived === 0 ? 'Active' : 'Archived',
        }))

        setUsers(formattedData)
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers()
  }, [])

if (loading) {
  return <div>Loading...</div>
}

  return (
    <div>
      <UserTable data={users} />
    </div>
  )
}

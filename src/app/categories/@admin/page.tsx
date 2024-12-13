'use client'

import React, { useEffect, useState } from 'react'
import { CategoryTable } from '@/components/tables/category-table'
import { getCategories } from '@/lib/api/categories'
import { getUsers } from '@/lib/api/users'
import CreateCategory from '@/components/modals/create-category'

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  role_name: string
}

interface ApiCategory {
  id: number
  category_name: string
  description: string
  personnel: {
    id: number
    first_name: string
    last_name: string
  }[]
}

interface TableCategory {
  id: number
  name: string
  description: string
  personnel: {
    id: number
    first_name: string
    last_name: string
  }[]
}

export default function Page() {
  const [categories, setCategories] = useState<TableCategory[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      const categoriesData = response.categories || [];
      const formattedData = categoriesData.map((category: ApiCategory): TableCategory => ({
        id: category.id,
        name: category.category_name,
        description: category.description || 'No description',
        personnel: category.personnel
      }));

      console.log('Formatted data:', formattedData);
      setCategories(formattedData);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers()
      const usersData = response.user || []
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchUsers()
  }, [])

  const handleCategoryCreated = () => {
    fetchCategories()
  }

  const formattedPersonnel = users
    .filter(user => {
      return user.role_name === "personnel"
    })
    .map(user => ({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name
    }))

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-4">
        <CreateCategory
          onCategoryCreated={handleCategoryCreated}
          personnel={formattedPersonnel}
        />
      </div>
      <CategoryTable data={categories} />
    </div>
  )
}
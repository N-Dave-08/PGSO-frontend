'use client'

import React, { useEffect, useState } from 'react'
import { CategoryTable } from '@/components/tables/category-table'
import { getCategories } from '@/lib/api/categories'

interface ApiCategory {
  id: number;
  category_name: string;
  description: string | null;
}

interface TableCategory {
  id: number;
  name: string;
  description: string;
}

export default function Page() {
  const [categories, setCategories] = useState<TableCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        const categoriesData = response.categories || [];
        const formattedData = categoriesData.map((category: ApiCategory): TableCategory => ({
          id: category.id,
          name: category.category_name,
          description: category.description || 'No description',
        }));
        
        console.log('Formatted data:', formattedData);
        setCategories(formattedData);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <CategoryTable data={categories} />
    </div>
  )
}
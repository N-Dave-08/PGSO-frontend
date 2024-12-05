'use client'

import React, { useEffect, useState } from 'react'
import { CategoryTable } from '@/components/tables/category-table'
import { getCategories } from '@/lib/api/categories'

export default function Page() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        console.log('Raw API Response:', response);
        
        // Extract the categories array from the response
        const categoriesData = response.categories || [];
        console.log('Categories array:', categoriesData);
        
        // Map the API data to match our table structure
        const formattedData = categoriesData.map(category => ({
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
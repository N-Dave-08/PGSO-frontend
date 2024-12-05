'use client'

import React, { useEffect, useState } from 'react'
import { getDepartments } from '@/lib/api/department'
import { DepartmentTable } from '@/components/tables/department-table'

export default function page() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartments();
        console.log('Raw API Response:', response);
        
        // Extract the departments array from the response
        const departmentsData = response.departments || [];
        console.log('Department array:', departmentsData);
        
        // Map the API data to match our table structure
        const formattedData = departmentsData.map(department => ({
          name: department.department_name,
          acronym: department.acronym,
          divisions: department.divisions || [],
          id: department.id
        }));
        
        console.log('Formatted data:', formattedData);
        setDepartments(formattedData);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <DepartmentTable data={departments} />
    </div>
  )
}
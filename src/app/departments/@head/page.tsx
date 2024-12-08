'use client'

import React, { useEffect, useState } from 'react'
import { getDepartments } from '@/lib/api/department'
import { DepartmentTable } from '@/components/tables/department-table'

interface Division {
  id: number;
  division_name: string;
  department_id: number;
}

interface ApiDepartment {
  id: number;
  department_name: string;
  acronym: string;
  divisions: Division[];
}

interface TableDepartment {
  id: number;
  name: string;
  acronym: string;
  divisions: Division[];
}

export default function Page() {
  const [departments, setDepartments] = useState<TableDepartment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await getDepartments();
        const departmentsData = response.departments || [];
        const formattedData = departmentsData.map((department: ApiDepartment): TableDepartment => ({
          name: department.department_name,
          acronym: department.acronym,
          divisions: department.divisions || [],
          id: department.id
        }));
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
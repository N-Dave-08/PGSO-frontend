'use client'

import React, { useEffect, useState } from 'react'
import { DivisionTable } from '@/components/tables/division-table'
import { getDivisions } from '@/lib/api/divisions'
import CreateDivision from '@/components/modals/create-division'

interface Staff {
  id: number;
  name: string;
  position: string;
}

interface ApiDivision {
  id: number;
  division_name: string;
  office_location: string;
  staff: Staff[];
  category: string;
  created_at: string;
}

interface TableDivision {
  id: number;
  name: string;
  officeLocation: string;
  staff: Staff[];
  category: string;
  dateCreated: string;
}

export default function Page() {
  const [divisions, setDivisions] = useState<TableDivision[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDivisions = async () => {
    try {
      const response = await getDivisions();
      const divisionsData = response.divisions || [];
      const formattedData = divisionsData.map((division: ApiDivision): TableDivision => ({
        id: division.id,
        name: division.division_name,
        officeLocation: division.office_location,
        staff: division.staff || [],
        category: division.category,
        dateCreated: division.created_at || new Date().toISOString()
      }));

      setDivisions(formattedData);
    } catch (error) {
      console.error('Failed to fetch divisions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDivisions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <CreateDivision onDivisionCreated={fetchDivisions} />
      <DivisionTable data={divisions} />
    </div>
  )
}
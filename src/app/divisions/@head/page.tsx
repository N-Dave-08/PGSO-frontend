'use client'

import React, { useEffect, useState } from 'react'
import { DivisionTable } from '@/components/tables/division-table'
import { getDivisions } from '@/lib/api/divisions'
import CreateDivision from '@/components/modals/create-division'

export default function Page() {
  const [divisions, setDivisions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDivisions = async () => {
    try {
      const response = await getDivisions();
      console.log('Raw API Response:', response);
      
      // Extract the divisions array from the response
      const divisionsData = response.divisions || [];
      console.log('Divisions array:', divisionsData);
      
      // Map the API data to match our table structure
      const formattedData = divisionsData.map(division => ({
        id: division.id,
        name: division.division_name,
        officeLocation: division.office_location,
        staff: division.staff || [],
        category: division.category,
        dateCreated: division.created_at || new Date().toISOString()
      }));
      
      console.log('Formatted data:', formattedData);
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Divisions</h2>
        <CreateDivision onDivisionCreated={fetchDivisions} />
      </div>
      <DivisionTable data={divisions} />
    </div>
  )
}
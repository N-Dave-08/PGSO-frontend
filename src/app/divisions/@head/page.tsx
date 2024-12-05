'use client'

import React, { useEffect, useState } from 'react'
import { DivisionTable } from '@/components/tables/division-table'
import { getDivisions } from '@/lib/api/divisions'

export default function page() {
  const [divisions, setDivisions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await getDivisions();
        console.log('Raw API Response:', response);
        
        // Extract the divisions array from the response
        const divisionsData = response.divisions || [];
        console.log('Divisions array:', divisionsData);
        
        // Map the API data to match our table structure
        const formattedData = divisionsData.map(division => ({
          name: division.division_name,
          officeLocation: division.office_location,
          staff: division.staff || 0,
          dateCreated: division.created_at || new Date().toISOString(),
          id: division.id
        }));
        
        console.log('Formatted data:', formattedData);
        setDivisions(formattedData);
      } catch (error) {
        console.error('Failed to fetch divisions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDivisions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <DivisionTable data={divisions} />
    </div>
  )
}
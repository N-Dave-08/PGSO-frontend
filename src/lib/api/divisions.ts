import axios from 'axios';

export interface CreateDivisionData {
    division_name: string;
    office_location: string;
    staff: string[];
    category_id: number;
}

export const createDivision = async (data: CreateDivisionData) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            'https://server.pgso.bpc-bsis4d.com/public/api/division/create',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating division:', error);
        throw error;
    }
}

export const getDivisions = async () => {
  try {
    const response = await axios.post('https://server.pgso.bpc-bsis4d.com/public/api/divisions');
    return response.data;
  } catch (error) {
    console.error('Error fetching divisions:', error);
    throw error;
  }
}
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
         if (!token) {
            throw new Error('Authentication token not found');
        }
        console.log('Creating division with data:', data);
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
        console.error('Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            data: data
        });
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`Division creation failed: ${errorMessage}`);
    }
}

export const getDivisions = async () => {
  try {
    const response = await axios.get('https://server.pgso.bpc-bsis4d.com/public/api/divisions');
    return response.data;
  } catch (error) {
    console.error('Error fetching divisions:', error);
    throw error;
  }
}
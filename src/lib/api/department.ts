import axios from 'axios';

export const getDepartments = async () => {
  try {
    const response = await axios.post('https://server.pgso.bpc-bsis4d.com/public/api/admin/department');
    return response.data;
  } catch (error) {
    console.error('Error fetching divisions:', error);
    throw error;
  }
}
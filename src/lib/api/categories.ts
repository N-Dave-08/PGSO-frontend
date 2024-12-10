import axios from 'axios';

export const getCategories = async () => {
  try {
    const response = await axios.post('https://server.pgso.bpc-bsis4d.com/public/api/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}
import axios from 'axios';

export const getRequests = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      'https://server.pgso.bpc-bsis4d.com/public/api/request/list',
      {}, 
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error('Unauthorized access. Please login again.');
    }
    console.error('Error fetching requests:', error);
    throw error;
  }
}
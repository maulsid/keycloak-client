import axios from 'axios';


export const fetchCodes = async (): Promise<any[]> => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}portal/admin/codes`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        Accept: 'application/json',
      },
    });
    const data = response.data;
    return data.codes || [] ;
  } catch (error) {
    
    throw error;
  }
};
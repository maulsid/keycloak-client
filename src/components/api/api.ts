import axios from 'axios';
import type { Customer } from '../../types';

export const fetchCodes = async (token: string | null): Promise<any[]> => {
  try {
    if (!token) {
      throw new Error('No authentication token provided');
    }
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}portal/admin/codes`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        Accept: 'application/json',
      },
    });
    const data = response.data;
    return data.codes || [];
  } catch (error) {

    throw error;
  }
};
export const fetchCustomers = async (token: string): Promise<Customer[]> => {
  try {
    if (!token) {
      throw new Error('No authentication token provided');
    }

    const url = `${import.meta.env.VITE_API_BASE_URL}portal/admin/customers`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    const data = response.data;
    return data.customers || [];
  } catch (error) {
    console.error('Error in fetchCustomers:', error);
    throw error;
  }
};
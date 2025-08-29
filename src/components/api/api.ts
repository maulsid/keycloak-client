import axios from "axios";
import type { Code, Customer } from "../../types";

export const fetchCodes = async (token: string | null): Promise<Code[]> => {
  if (!token) {
    throw new Error("No authentication token provided");
  }
  const response = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}portal/admin/codes`,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        Accept: "application/json",
      },
    },
  );
  const data = response.data;
  return data.codes || [];
};
export const fetchCustomers = async (token: string): Promise<Customer[]> => {
  if (!token) {
    throw new Error("No authentication token provided");
  }

  const url = `${import.meta.env.VITE_API_BASE_URL}portal/admin/customers`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const data = response.data;
  return data.customers || [];
};

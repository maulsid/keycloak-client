import axios from "axios";
import type { Code, Customer,  InviteCreateExistingPayload, InviteCreateNewOrgCustomerPayload, InviteResponse,VerifyInviteResponse } from "../../types";

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

export async function createInvitationExisting(
  token: string,
  payload: InviteCreateExistingPayload
): Promise<InviteResponse> {
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}portal/admin/invitations`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return res.data;
}

// New org + new customer → invite first user
export async function createInvitationNew(
  token: string,
  payload: InviteCreateNewOrgCustomerPayload
): Promise<InviteResponse> {
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}portal/admin/invitations`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return res.data;
}

// Create initial order (used right after new customer is created)
// Adjust payload shape if your backend expects different keys.
export async function createOrder(
  token: string,
  payload: { customer_id: number; quantity: number }
): Promise<any> {
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}portal/admin/orders`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return res.data;
}

/** Verify invitation token (PUBLIC – no auth header) */
export const verifyInvitationPublic = async (
  tokenParam: string
): Promise<VerifyInviteResponse> => {
  const url = `${import.meta.env.VITE_API_BASE_URL}portal/invitations/verify?token=${encodeURIComponent(
    tokenParam
  )}`;
  const response = await axios.get(url, {
    headers: { Accept: "application/json" },
    validateStatus: (s) => s < 500, // surface 4xx to UI
  });
  const data = response.data as any;
  if (data?.error) throw new Error(data.error);
  return data as VerifyInviteResponse;
};

export async function createOrdersProvisionStyle(
  token: string,
  payload: Array<{
    idempotency_key: string;
    customer: {
      id: number;
      create: boolean; // false here
      customer_type: "B2B";
      address: string;
      status: "active";
      low_inventory_threshold?: number;
    };
    order: {
      dispense_type: "self_dispense";
      order_received_date: string; // YYYY-MM-DD (date only)
      codes_send_date: string | null; // keep null
      number_of_codes: number;
    };
  }>,
) {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}portal/admin/orders`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );
  return res.data;
}
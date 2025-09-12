import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaCopy,
  FaExclamationTriangle,
  FaUser,
} from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  createInvitationExisting,
  createInvitationNew,
  createOrdersProvisionStyle,
  fetchCustomers,
} from "../../../components/api/api";
import Header from "../../../components/common/Header";
import { useAuth } from "../../../context/CognitoAuth";
import type { Customer } from "../../../types";

interface FormData {
  // We’ll treat these fields as the single shared UI for both flows
  organizationName: string;
  organizationAddress: string; // (we’ll fold street/city/state/zip into one display string)
  customerName: string;
  primaryContactName: string;
  primaryContactEmail: string; // used as invitee email in both flows
  primaryContactPhone: string;
  initialAccessCodes: number;
  inviteTtlDays: number;
}

export default function CreateCustomer() {
  const { token } = useAuth();
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  // Existing flow detection
  const qpOrgId = sp.get("organization_id");
  const qpCustomerId = sp.get("customer_id");
  const isExistingMode = Boolean(qpOrgId && qpCustomerId);
  const organizationId = qpOrgId ? Number(qpOrgId) : undefined;
  const customerId = qpCustomerId ? Number(qpCustomerId) : undefined;

  const [formData, setFormData] = useState<FormData>({
    organizationName: "",
    organizationAddress: "",
    customerName: "",
    primaryContactName: "",
    primaryContactEmail: "",
    primaryContactPhone: "",
    initialAccessCodes: 50,
    inviteTtlDays: 14,
  });

  // load/derive selected customer (existing mode)
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const [generatedInvitation, setGeneratedInvitation] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch customers for existing mode
  useEffect(() => {
    const load = async () => {
      if (!isExistingMode || !token) return;
      try {
        const data = await fetchCustomers(token);
        setCustomers(data || []);
      } catch (e) {
        setError("Failed to load customer details.");
      }
    };
    load();
  }, [isExistingMode, token]);

  // Pick the matching customer and prefill the form read-only
  useEffect(() => {
    if (!isExistingMode || !customers.length || !customerId) {
      setSelectedCustomer(null);
      return;
    }
    const match = customers.find((c) => Number(c.customer_id) === customerId);
    setSelectedCustomer(match || null);
  }, [customers, isExistingMode, customerId]);

  // Prefill shared form with existing values (but keep email editable)
  useEffect(() => {
    if (!isExistingMode || !selectedCustomer) return;

    setFormData((prev) => ({
      ...prev,
      organizationName: selectedCustomer.organization_name || "",
      organizationAddress: selectedCustomer.organization_address || "",
      customerName: selectedCustomer.name || "",
      // keep contact name/phone empty (these are display-only in existing mode)
      primaryContactName: prev.primaryContactName,
      primaryContactEmail: prev.primaryContactEmail, // user will type the invitee email
      primaryContactPhone: prev.primaryContactPhone,
    }));
  }, [isExistingMode, selectedCustomer]);

  const disabled = isExistingMode; // one place to control disabling of shared fields
  const ROLE_ID = 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setGeneratedInvitation("");
    setOrderNote("");

    try {
      if (!token) {
        setError("You must be logged in to perform this action.");
        return;
      }

      // Shared validation: email must be present (it’s the invitee)
      if (!formData.primaryContactEmail) {
        setError("Please enter the invitee email.");
        return;
      }

      if (isExistingMode) {
        // ===== EXISTING org + customer → invite user only =====
        const res = await createInvitationExisting(token, {
          organization_id: organizationId!,
          customer_id: customerId!,
          email: formData.primaryContactEmail,
          ttl_days: formData.inviteTtlDays,
          role_id: ROLE_ID,
        });
        setGeneratedInvitation(res.invite_link);
        setSuccess(true);
        return;
      }

      // ===== NEW org + customer → invite + create initial order =====
      if (!formData.organizationName || !formData.customerName) {
        setError("Please fill in required fields.");
        return;
      }

      // Invite new primary contact to new org/customer
      const inviteRes = await createInvitationNew(token, {
        new_organization: {
          name: formData.organizationName,
          address: formData.organizationAddress || undefined,
        },
        new_customer: {
          // Use the customer name exactly as typed; backend will create the Customer
          name: formData.customerName,
          address: formData.organizationAddress || undefined,
          customer_type: "B2B",
        },
        email: formData.primaryContactEmail,
        ttl_days: formData.inviteTtlDays,
        role_id: ROLE_ID,
      });

      setGeneratedInvitation(inviteRes.invite_link);

      // Create a batch order as per your API shape (by name, array payload)
      if (formData.initialAccessCodes > 0) {
        try {
          // 1) Re-fetch customers to get the new customer's ID by name
          const freshCustomers = await fetchCustomers(token);
          const created = freshCustomers.find(
            (c) => (c.name || "").trim() === formData.customerName.trim()
          );

          if (!created) {
            throw new Error(
              "Could not find the newly created customer to place the initial order."
            );
          }

          // 2) Build ProvisionCodes-style payload
          const today = new Date();
          const yyyy = today.getFullYear();
          const mm = String(today.getMonth() + 1).padStart(2, "0");
          const dd = String(today.getDate()).padStart(2, "0");
          const dateOnly = `${yyyy}-${mm}-${dd}`; // 'YYYY-MM-DD'

          const idempotencyKey = `order-${dateOnly}-cust${created.customer_id}`;

          const payload = [
            {
              idempotency_key: idempotencyKey,
              customer: {
                id: Number(created.customer_id),
                create: false,
                customer_type: "B2B" as const,
                address:
                  created.organization_address ||
                  formData.organizationAddress ||
                  "N/A",
                status: "active" as const,
              },
              order: {
                dispense_type: "self_dispense" as const,
                order_received_date: dateOnly,
                codes_send_date: null as string | null,
                number_of_codes: formData.initialAccessCodes,
              },
            },
          ];

          // 3) Call the same endpoint as ProvisionCodes
          await createOrdersProvisionStyle(token, payload);

          setOrderNote(
            `Initial order of ${formData.initialAccessCodes} codes has been created.`
          );
        } catch (orderErr: any) {
          console.error("initial order error:", orderErr);
          setOrderNote(
            "Customer was created and invited, but initial order failed. You can provision codes later from the dashboard."
          );
        }
      }
      setSuccess(true);
    } catch (err: any) {
      console.error("Create/Invite error:", err);
      setError(err?.message || "Request failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyInvitationLink = () => {
    if (generatedInvitation) navigator.clipboard.writeText(generatedInvitation);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
          <FaCheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            {isExistingMode
              ? "Invitation Sent!"
              : "Customer Created Successfully!"}
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            {isExistingMode
              ? "The invitation has been created."
              : "The customer account has been created and an invitation link has been generated."}
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Invitation Link
            </h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={generatedInvitation}
                readOnly
                className="flex-1 px-3 py-2 border border-blue-300 rounded-md text-sm bg-white"
              />
              <button
                onClick={copyInvitationLink}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
              >
                <FaCopy className="h-4 w-4 mr-1" />
                Copy
              </button>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Send this link to the user to allow them to register for the
              portal.
            </p>
          </div>

          {orderNote && !isExistingMode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-6 text-sm text-yellow-800">
              {orderNote}
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={() => {
                setSuccess(false);
                setGeneratedInvitation("");
                setOrderNote("");
                setFormData({
                  organizationName: "",
                  organizationAddress: "",
                  customerName: "",
                  primaryContactName: "",
                  primaryContactEmail: "",
                  primaryContactPhone: "",
                  initialAccessCodes: 50,
                  inviteTtlDays: 14,
                });
              }}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              {isExistingMode
                ? "Send Another Invite"
                : "Create Another Customer"}
            </button>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={
          isExistingMode
            ? "Invite User to Existing Customer"
            : "Create New Customer"
        }
        showBackButton
        backLink="/admin/dashboard"
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {isExistingMode
                ? "Customer & Organization (Read-only)"
                : "Customer Information"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isExistingMode
                ? "These fields are pre-populated from the selected customer."
                : "Create a new customer account and generate an invitation link for portal access."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <FaExclamationTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Organization details (same UI; disabled in existing mode) */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">
                Organization Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required={!disabled}
                    disabled={disabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    placeholder="e.g., Acme Medical Center"
                    value={formData.organizationName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        organizationName: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Address
                  </label>
                  <input
                    type="text"
                    disabled={disabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    placeholder="Street, City, State, ZIP"
                    value={formData.organizationAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        organizationAddress: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Customer details (same UI; disabled in existing mode) */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">
                Customer Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required={!disabled}
                    disabled={disabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    placeholder="e.g., Acme Medical Center - West"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Primary contact / invitee (email is always editable) */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">
                Primary Contact / Invitee
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    disabled={disabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    placeholder="Full name"
                    value={formData.primaryContactName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        primaryContactName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      // NOTE: email stays editable in both modes
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="contact@example.com"
                      value={formData.primaryContactEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          primaryContactEmail: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      disabled={disabled}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                      placeholder="(555) 123-4567"
                      value={formData.primaryContactPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          primaryContactPhone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Invitation Expires in (days)
                    </label>
                    <input
                      type="number"
                      min={1}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={formData.inviteTtlDays}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          inviteTtlDays: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Initial codes (only relevant for new flow) */}
            {!isExistingMode && (
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">
                  Initial Access Codes
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Access Codes
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    value={formData.initialAccessCodes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        initialAccessCodes: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We’ll create a batch order right after the invite succeeds.
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-6">
              <span
                onClick={() => window.history.back()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </span>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isExistingMode ? "Sending..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <FaUser className="h-4 w-4 mr-2" />
                    {isExistingMode ? "Send Invitation" : "Create Customer"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {!isExistingMode && (
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              Important Information
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• A unique Customer will be created</li>
              <li>
                • An invitation link will be created for the user to register
              </li>
              <li>• A batch order will be created immediately</li>
              <li>
                • You can provision additional codes later from the admin
                dashboard
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

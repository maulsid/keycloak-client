import { useState } from "react";
import {
  FaUser,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCopy,
} from "react-icons/fa";
import Header from "../../../components/common/Header";

// Define the shape of form data
interface FormData {
  customerName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  initialAccessCodes: number;
}

export default function CreateCustomer() {
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    primaryContactName: "",
    primaryContactEmail: "",
    primaryContactPhone: "",
    initialAccessCodes: 50,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [generatedInvitation, setGeneratedInvitation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Validate form
      if (
        !formData.customerName ||
        !formData.primaryContactName ||
        !formData.primaryContactEmail
      ) {
        setError("Please fill in all required fields");
        return;
      }
      // Generate customer ID and invitation link
      const customerId = `CUST-${new Date().getFullYear()}-${Math.floor(
        Math.random() * 1000,
      )
        .toString()
        .padStart(3, "0")}`;
      const invitationLink = `https://rejoyn-portal.com/register?invite=${btoa(customerId)}`;
      setGeneratedInvitation(invitationLink);
      setSuccess(true);
    } catch (err) {
      setError("Failed to create customer. Please try again.");
      console.log("err", err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyInvitationLink = () => {
    navigator.clipboard.writeText(generatedInvitation);
    // You could add a toast notification here
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
          <FaCheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Customer Created Successfully!
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            The customer account has been created and an invitation link has
            been generated.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <h3 className="text-sm font-medium text-green-800 mb-2">
              Customer Details
            </h3>
            <div className="space-y-2 text-sm text-green-700">
              <p>
                <strong>Customer Name:</strong> {formData.customerName}
              </p>
              <p>
                <strong>Primary Contact:</strong> {formData.primaryContactName}
              </p>
              <p>
                <strong>Email:</strong> {formData.primaryContactEmail}
              </p>
              <p>
                <strong>Initial Access Codes:</strong>{" "}
                {formData.initialAccessCodes}
              </p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
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
              Send this link to the customer to allow them to register for the
              portal.
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({
                  customerName: "",
                  address: "",
                  city: "",
                  state: "",
                  zipCode: "",
                  primaryContactName: "",
                  primaryContactEmail: "",
                  primaryContactPhone: "",
                  initialAccessCodes: 50,
                });
              }}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Create Another Customer
            </button>
            <a
              href="/admin/dashboard"
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Create New Customer"
        showBackButton
        backLink="/admin/dashboard"
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Customer Information
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Create a new customer account and generate an invitation link for
              portal access.
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
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">
                Organization Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="customerName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Organization Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Acme Medical Center"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Street address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="zipCode"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ZIP code"
                      value={formData.zipCode}
                      onChange={(e) =>
                        setFormData({ ...formData, zipCode: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">
                Primary Contact
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="primaryContactName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Contact Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="primaryContactName"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                    <label
                      htmlFor="primaryContactEmail"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="primaryContactEmail"
                      required
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
                    <label
                      htmlFor="primaryContactPhone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="primaryContactPhone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
              </div>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">
                Initial Access Codes
              </h3>
              <div>
                <label
                  htmlFor="initialAccessCodes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Number of Access Codes
                </label>
                <input
                  type="number"
                  id="initialAccessCodes"
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
                  This will be the initial allocation of access codes for the
                  customer.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-6">
              <span
                onClick={() => window.history.back()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
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
                    Creating...
                  </>
                ) : (
                  <>
                    <FaUser className="h-4 w-4 mr-2" />
                    Create Customer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Important Information
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• A unique Customer ID will be automatically generated</li>
            <li>
              • An invitation link will be created for the customer to register
            </li>
            <li>
              • The customer will receive the specified number of initial access
              codes
            </li>
            <li>
              • You can provision additional codes later through the admin
              dashboard
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

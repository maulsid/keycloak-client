import { useState, useEffect } from "react";
import {
  FaKey,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSearch,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "../../../components/common/Loading";
import { Error } from "../../../components/common/Error";
import Header from "../../../components/common/Header";
import { fetchCustomersThunk } from "../../../redux/slices/customerSlice";
import { useAuth } from "../../../context/CognitoAuth";
import type { RootState } from "../../../redux/store";

// Define the shape of customer data
interface Customer {
  id: string;
  name: string;
  primaryContact: string;
  email: string;
  phoneNumber: string; // Added phoneNumber to the interface
  currentCodes: number;
  totalPurchased: number;
  organizationAddress?: string;
  customer_contacts?: any[];
}

export default function ProvisionCodes() {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const { token } = useAuth();
  const { customers, loading, error: fetchError } = useSelector(
    (state: RootState) => state.customers,
  );

  // Fetch customers when component mounts or token changes
  useEffect(() => {
    if (token) {
      dispatch(fetchCustomersThunk(token) as any);
    } else {
      dispatch({
        type: "customers/fetchCustomers/rejected",
        payload: "No authentication token available",
      });
    }
  }, [dispatch, token]);

  // Transform API response to match Customer interface
  const transformedCustomers: Customer[] = customers.map((customer) => ({
    id: customer.customer_id.toString(),
    name: customer.name,
    primaryContact:
      customer.customer_contacts && customer.customer_contacts.length > 0
        ? `${customer.customer_contacts[0].first_name} ${customer.customer_contacts[0].last_name}`
        : "Unknown Contact",
    email:
      customer.customer_contacts  && customer.customer_contacts.length > 0
        ? customer.customer_contacts[0].email
        : "No email provided",
    phoneNumber:
      customer.customer_contacts && customer.customer_contacts.length > 0
        ? customer.customer_contacts[0].phone_number
        : "No phone number provided",
    currentCodes: customer.codes_available,
    totalPurchased: customer.total_codes_ordered,
  }));

  const filteredCustomers = transformedCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.primaryContact.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedCustomerData = transformedCustomers.find(
    (c) => c.id === selectedCustomer,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // Validate form
      if (!selectedCustomer) {
        setError("Please select a customer");
        return;
      }
      if (quantity <= 0 || quantity > 1000) {
        setError("Please enter a valid quantity (1-1000)");
        return;
      }

      // Prepare API payload
      const payload = [
        {
          idempotency_key: `order-${new Date().toISOString().split('T')[0]}-cust${selectedCustomer}`,
          customer: {
            id: parseInt(selectedCustomer),
            create: false,
            customer_type: "B2B",
            address: selectedCustomerData?.organizationAddress || "123 Main St, Denver CO",
            status: "active",
            // low_inventory_threshold: 10,
          },
          order: {
            dispense_type: "self_dispense",
            order_received_date: new Date().toISOString().split('T')[0],
            codes_send_date: null,
            number_of_codes: quantity,
          },
        },
      ];

      // Make API call
      const response = await fetch( `${import.meta.env.VITE_API_BASE_URL}portal/admin/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
       console.log("Error response data:", errorData);
       
      }

      // Success
      setSuccess(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        setSelectedCustomer("");
        setQuantity(0);
      }, 3000);
    } catch (err) {
      setError("Failed to provision codes. Please try again.");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (fetchError || error) {
    return <Error message={fetchError || error || "Error Loading Customers"} />;
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <FaCheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Codes Provisioned Successfully!
          </h2>
          <p className="text-gray-600 mb-4">
            {quantity} access codes have been added to{" "}
            {selectedCustomerData?.name}.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <p className="text-sm text-green-800">
              <strong>New Total:</strong>{" "}
              {selectedCustomerData
                ? selectedCustomerData.currentCodes + quantity
                : quantity}{" "}
              codes
            </p>
          </div>
          <span
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Dashboard
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Provision Access Codes"
        showBackButton
        backLink={"/admin/dashboard"}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Add Access Codes
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select a customer and specify the number of access codes to
              provision.
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
              <label
                htmlFor="customer"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Customer <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/4 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 mb-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedCustomer === customer.id
                        ? "bg-blue-50 border-blue-200"
                        : ""
                    }`}
                    onClick={() => setSelectedCustomer(customer.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {customer.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          ID: {customer.id}
                        </p>
                        <p className="text-xs text-gray-500">
                          Contact: {customer.phoneNumber}
                        </p>
                        <p className="text-xs text-gray-500">
                          Email: {customer.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">
                          {customer.currentCodes} codes available
                        </p>
                        <p className="text-xs text-gray-500">
                          {customer.totalPurchased} total purchased
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Number of Access Codes <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                max="1000"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={quantity || ""}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the number of access codes to add to the selected
                customer's account.
              </p>
            </div>
            {selectedCustomerData && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  Selected Customer
                </h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>
                    <strong>Name:</strong> {selectedCustomerData.name}
                  </p>
                  <p>
                    <strong>Contact:</strong>{" "}
                    {selectedCustomerData.primaryContact}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedCustomerData.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedCustomerData.phoneNumber}
                  </p>
                  <p>
                    <strong>Current Codes:</strong>{" "}
                    {selectedCustomerData.currentCodes}
                  </p>
                  <p>
                    <strong>After Provisioning:</strong>{" "}
                    {selectedCustomerData.currentCodes + quantity}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between pt-6">
              <span
                onClick={() => window.history.back()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </span>
              <button
                type="submit"
                disabled={isLoading || !selectedCustomer || quantity <= 0}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Provisioning...
                  </>
                ) : (
                  <>
                    <FaKey className="h-4 w-4 mr-2" />
                    Provision Codes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Customer Summary
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available Codes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Purchased
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transformedCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">
                          {customer.primaryContact}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.phoneNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.currentCodes}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer.totalPurchased}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            About Code Provisioning
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • Provisioned codes are immediately available to the customer
            </li>
            <li>• Codes are unique and can only be used once per patient</li>
            <li>• You can provision codes to existing customers at any time</li>
            <li>• The customer will be notified of the new code allocation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
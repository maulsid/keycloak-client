import { useState, useEffect } from "react";
import CustomerStatCard from "../../components/customer/CustomerStatsCard";
import type { CustomerData } from "../../types";
import CustomerInfo from "../../components/customer/CustomerInfo";
import CustomerActionCard from "../../components/customer/CustomerActionCard";
import CustomerActivityItem from "../../components/customer/CustomerActivityItem";
import { actionCards, statCards } from "../../utils/data/CutomerDashbaordData";
import Header from "../../components/common/Header";
import { Loading } from "../../components/common/Loading";
import { Error } from "../../components/common/Error";
import CustomerFooter from "../../components/customer/CustomerFooter";
import { useAuth } from "../../context/CognitoAuth";

// Define user outside the component to ensure a stable reference
const user = {
  id: "001",
  companyName: "Medical Center",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@medicalcenter.com",
  phoneNumber: "555-123-4567",
};

// Main CustomerDashboard Component
const CustomerDashboard: React.FC = () => {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [availableCodes, setAvailableCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { customerId, token } = useAuth(); // Access auth details
  console.log("ava", availableCodes);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);

        // Fetch customer stats based on the curl command
        const statsResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}portal/hcp/customers/${customerId}/stats`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        const statsData = await statsResponse.json();

        if (!statsResponse.ok) {
          console.log("statsResponse", statsResponse);
        }

        // Fetch available codes and profile data
        const codesResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}portal/hcp/customers/${customerId}/profile`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        const codesData = await codesResponse.json();

        if (!codesResponse.ok) {
          console.log("codesResponse", codesResponse);
        }

        // Map the API response for available codes
        const codes = codesData.codes?.map((c: any, index: number) => ({
          id: index.toString(),
          code: c.code,
          status: c.status || "unassigned",
          assignedDate: c.assignedDate || new Date().toISOString(),
        })) || [];

        // Map stats data from API response
        const mappedStats = {
          availableCodesCount: statsData.availableCodes || 0,
          utilizedCodesCount: statsData.utilizedCodes || 0,
          totalPurchasedCodes: statsData.totalPurchased || 0,
          purchasedCodes: statsData.purchasedCodes || [], // Assuming this is an array from API
          utilizedCodes: statsData.utilizedCodesDetails || [], // Assuming detailed data
          availableCodes: codes, // Linking available codes here
        };

        // Combine data
        setCustomerData({
          customerId: `CUST-${customerId}`,
          name: user.companyName,
          primaryContact: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phoneNumber,
          ...mappedStats, // Spread mapped stats
          recentActivity: [
            {
              id: 1,
              action: "New access code requested",
              patientId: "PAT-001",
              date: "2024-01-15",
              status: "completed",
            },
            {
              id: 2,
              action: "Patient report viewed",
              patientId: "PAT-002",
              date: "2024-01-14",
              status: "completed",
            },
            {
              id: 3,
              action: "Marketing materials downloaded",
              patientId: undefined,
              date: "2024-01-13",
              status: "completed",
            },
          ],
        });
        setAvailableCodes(codes);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load customer data or available codes");
      } finally {
        setLoading(false);
      }
    };

    if (customerId && token) {
      fetchCustomerData();
    } else {
      setLoading(false);
      setError("Unable to retrieve customer ID or token");
    }
  }, [customerId, token]);

  if (loading) {
    return <Loading />;
  }

  if (error || !customerData) {
    return <Error message={error || "Failed to load customer dashboard"} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        title="Rejoyn Portal"
        primaryContact={customerData.primaryContact}
        isSettings
      />

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <CustomerStatCard
              key={index}
              title={card.title}
              value={card.value(customerData)}
              icon={card.icon}
              iconColor={card.iconColor}
            />
          ))}
        </div>
        <CustomerInfo customerData={customerData} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 cursor-pointer">
          {actionCards.map((card, index) => (
            <CustomerActionCard
              key={index}
              title={card.title}
              description={card.description}
              link={card.link}
              icon={card.icon}
              iconColor={card.iconColor}
            />
          ))}
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Activity
            </h2>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              {customerData.recentActivity.map((activity) => (
                <CustomerActivityItem
                  key={activity.id}
                  action={activity.action}
                  patientId={activity.patientId}
                  date={activity.date}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <CustomerFooter />
    </div>
  );
};

export default CustomerDashboard;
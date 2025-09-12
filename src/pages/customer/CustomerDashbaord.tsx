import { useEffect, useState } from "react";
import { Error } from "../../components/common/Error";
import Header from "../../components/common/Header";
import { Loading } from "../../components/common/Loading";
import CustomerActionCard from "../../components/customer/CustomerActionCard";
import CustomerActivityItem from "../../components/customer/CustomerActivityItem";
import CustomerFooter from "../../components/customer/CustomerFooter";
import CustomerInfo from "../../components/customer/CustomerInfo";
import CustomerStatCard from "../../components/customer/CustomerStatsCard";
import { useAuth } from "../../context/CognitoAuth";
import type { CustomerData } from "../../types";
import { actionCards, statCards } from "../../utils/data/CutomerDashbaordData";

// Define user outside the component to ensure a stable reference
// const user = {
//   id: "001",
//   companyName: "Medical Center",
//   firstName: "John",
//   lastName: "Doe",
//   email: "john.doe@medicalcenter.com",
//   phoneNumber: "555-123-4567",
// };

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

        const statsResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}portal/hcp/customers/${customerId}/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const statsData = await statsResponse.json();

        if (!statsResponse.ok) console.log("statsResponse", statsResponse);

        const codesResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}portal/hcp/customers/${customerId}/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const codesData = await codesResponse.json();

        if (!codesResponse.ok) console.log("codesResponse", codesResponse);

        const mappedStats = {
          availableCodesCount: statsData.codes_available || 0,
          utilizedCodesCount: statsData.codes_utilized || 0,
          totalPurchasedCodes: statsData.total_codes_purchased || 0,
          purchasedCodes: statsData.total_codes_purchased
            ? Array(statsData.total_codes_purchased).fill(null)
            : [],
          utilizedCodes: statsData.codes_utilized
            ? Array(statsData.codes_utilized).fill(null)
            : [],
          availableCodes: [], // Adjust if codes come from a different endpoint
        };

        setCustomerData({
          customerId: `CUST-${customerId}`,
          name: codesData.organization_name || "--",
          primaryContact: `${codesData.customer_contacts[0]?.first_name || codesData.customer_contacts[0]?.last_name ? codesData.customer_contacts[0]?.first_name + codesData.customer_contacts[0]?.last_name : "--"}`,
          email: codesData.customer_contacts[0]?.email || "--",
          phone: codesData.customer_contacts[0]?.phone_number || "--",
          ...mappedStats,
          recentActivity: [
            // {
            //   id: 1,
            //   action: "New access code requested",
            //   patientId: "PAT-001",
            //   date: "2024-01-15",
            //   status: "completed",
            // },
            // {
            //   id: 2,
            //   action: "Patient report viewed",
            //   patientId: "PAT-002",
            //   date: "2024-01-14",
            //   status: "completed",
            // },
            // {
            //   id: 3,
            //   action: "Marketing materials downloaded",
            //   patientId: undefined,
            //   date: "2024-01-13",
            //   status: "completed",
            // },
          ],
        });
        setAvailableCodes(mappedStats.availableCodes);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load customer data or available codes");
      } finally {
        setLoading(false);
      }
    };

    if (customerId && token) fetchCustomerData();
    else {
      setLoading(false);
      setError("Unable to retrieve customer ID or token");
    }
  }, [customerId, token]);
  console.log(customerData);
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

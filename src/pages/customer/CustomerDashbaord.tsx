import { useEffect } from "react";
import CustomerStatCard from "../../components/customer/CustomerStatsCard";
import CustomerInfo from "../../components/customer/CustomerInfo";
import CustomerActionCard from "../../components/customer/CustomerActionCard";
import CustomerActivityItem from "../../components/customer/CustomerActivityItem";
import { actionCards, statCards } from "../../utils/data/CutomerDashbaordData";
import Header from "../../components/common/Header";
import { Loading } from "../../components/common/Loading";
import { Error } from "../../components/common/Error";
import CustomerFooter from "../../components/customer/CustomerFooter";
import { useAuth } from "../../context/CognitoAuth";
import { useAppDispatch, useAppSelector } from "../../redux/redux-hooks";
import { fetchCustomerDashboard } from "../../redux/slices/customerDashboardSlice";

const CustomerDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { customerData, availableCodes, loading, error } = useAppSelector(
    (state) => state.customerDashbaord
  );
  const { customerId, token } = useAuth();

  console.log("availableCodes", availableCodes);

  useEffect(() => {
    if (customerId && token) {
      dispatch(fetchCustomerDashboard({ customerId, token }) as any);
    }
  }, [customerId, token, dispatch]);

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
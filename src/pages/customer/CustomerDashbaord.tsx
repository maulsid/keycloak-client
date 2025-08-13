import { useState, useEffect } from 'react';
import CustomerStatCard from '../../components/customer/CustomerStatsCard';
import type { CustomerData } from '../../types';
import CustomerInfo from '../../components/customer/CustomerInfo';
import CustomerActionCard from '../../components/customer/CustomerActionCard';
import CustomerActivityItem from '../../components/customer/CustomerActivityItem';
import { actionCards, statCards } from '../../utils/data/CutomerDashbaordData';
import Header from '../../components/common/Header';

// Define user outside the component to ensure a stable reference
const user = {
  id: '001',
  companyName: 'Medical Center',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@medicalcenter.com',
  phoneNumber: '555-123-4567',
};

// Main CustomerDashboard Component
const CustomerDashboard: React.FC = () => {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        // Mock data since apiService is removed
        const mockData: CustomerData = {
          customerId: `CUST-${user.id}`,
          name: user.companyName,
          primaryContact: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phoneNumber,
          purchasedCodes: 100,
          utilizedCodes: 60,
          availableCodes: 40,
          recentActivity: [
            { id: 1, action: 'New access code requested', patientId: 'PAT-001', date: '2024-01-15', status: 'completed' },
            { id: 2, action: 'Patient report viewed', patientId: 'PAT-002', date: '2024-01-14', status: 'completed' },
            { id: 3, action: 'Marketing materials downloaded', patientId: undefined, date: '2024-01-13', status: 'completed' },
          ],
        };
        setCustomerData(mockData);
      } catch (err) {
        console.error('Error fetching customer data:', err);
        setError('Failed to load customer data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCustomerData();
    } else {
      setLoading(false);
    }
  }, []); // Empty dependency array since user is static

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !customerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || 'Failed to load dashboard'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Rejoyn Portal" primaryContact={customerData.primaryContact} isSettings />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <CustomerStatCard
              key={index}
              title={card.title}
              value={card.value(customerData)} // Resolve value function
              icon={<card.icon />}
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
              icon={<card.icon />}
              iconColor={card.iconColor}
            />
          ))}
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
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
    </div>
  );
};

export default CustomerDashboard;
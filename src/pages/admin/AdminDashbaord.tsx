import { useState, useEffect, type JSX } from 'react';
import AdminStatCard from '../../components/admin/AdminStatsCard';
import type { AdminData } from '../../types';
import AdminActionCard from '../../components/admin/AdminActionCard';
import AdimnAlertBanner from '../../components/admin/AdminAlertBanner';
import AdminActivityItem from '../../components/admin/AdminActivityItem';
import { actionCards, statCards } from '../../utils/data/AdminDashboardData';
import Header from '../../components/common/Header';
// Main AdminDashboard Component
const AdminDashboard: React.FC = () => {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock data since useAuth and apiService are removed
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const mockData: AdminData = {
          totalCustomers: 150,
          activeCustomers: 120,
          totalAccessCodes: 500,
          utilizedCodes: 300,
          availableCodes: 200,
          pendingInvitations: 3,
          recentActivity: [
            { id: 1, action: 'New customer created', customerName: 'City Medical Center', date: '2024-01-15', status: 'completed' },
            { id: 2, action: 'Access codes provisioned', customerName: 'Acme Medical Center', date: '2024-01-14', status: 'completed' },
            { id: 3, action: 'Customer invitation sent', customerName: 'Regional Hospital', date: '2024-01-13', status: 'completed' },
            { id: 4, action: 'Access codes provisioned', customerName: 'Community Clinic', date: '2024-01-12', status: 'completed' },
          ],
        };
        setAdminData(mockData);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

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

  if (error || !adminData) {
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
      <Header title="Admin Dashboard" primaryContact="Administrator" isSettings />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <AdminStatCard
              key={index}
              title={card.title}
              value={card.value(adminData)}
              icon={card.icon}
              color={card.color}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {actionCards.map((card, index) => (
            <AdminActionCard key={index} {...card} />
          ))}
        </div>
        {adminData.pendingInvitations > 0 && (
          <AdimnAlertBanner pendingInvitations={adminData.pendingInvitations} />
        )}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-4">
              {adminData.recentActivity.map((activity) => (
                <AdminActivityItem
                  key={activity.id}
                  action={activity.action}
                  customerName={activity.customerName}
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

export default AdminDashboard;

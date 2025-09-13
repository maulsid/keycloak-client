import { useState, useEffect } from "react";
import AdminStatCard from "../../components/admin/AdminStatsCard";
import type { AdminData } from "../../types";
import AdminActionCard from "../../components/admin/AdminActionCard";
import AdimnAlertBanner from "../../components/admin/AdminAlertBanner";
import AdminActivityItem from "../../components/admin/AdminActivityItem";
import { actionCards, statCards } from "../../utils/data/AdminDashboardData";
import Header from "../../components/common/Header";
import { Loading } from "../../components/common/Loading";
import { Error } from "../../components/common/Error";
import { useAuth } from "../../context/CognitoAuth";

// Main AdminDashboard Component
const AdminDashboard: React.FC = () => {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth(); // Access auth details

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}portal/admin/customers/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });


        if (!response.ok) {
          console.log("errresponse", response);

        }

        const data = await response.json();
        setAdminData({
          totalCustomers: data.stats.total_customers || 0,
          activeCustomers: data.stats.active_customers || 0,
          totalAccessCodes: data.stats.total_codes || 0,
          utilizedCodes: data.stats.total_codes_utilized || 0,
          availableCodes: data.stats.total_codes_available || 0,
          pendingInvitations: data.stats.pending_invitations || 0,
          totalCodes: data.stats.total_codes_ordered || 0,
          recentActivity: data.stats.recent_activity || [], // Adjust based on API response structure
        });
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setError("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error || !adminData) {
    return <Error message={error || "Failed to load admin dashboard"} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Admin Dashboard"
        primaryContact="Administrator"
        isSettings
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <AdminStatCard
              key={index}
              title={card.title}
              value={card.value(adminData)}
              icon={card.icon}
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
            <h2 className="text-lg font-medium text-gray-900">
              Recent Activity
            </h2>
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
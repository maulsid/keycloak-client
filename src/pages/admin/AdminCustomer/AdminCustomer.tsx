import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../../../components/common/Loading';
import { Error } from '../../../components/common/Error';
import Header from '../../../components/common/Header';
import type { Customer } from '../../../types';
import { CustomerCards } from '../../../components/admin/customer/CustomerCards';
import { CustomerTable } from '../../../components/admin/customer/CustomerTable';
import { CustomerManagementInfo } from '../../../components/admin/customer/CustomerManagementInfo';
import { customerData } from '../../../utils/data/AdminCustomer';
import { SearchFilter } from '../../../components/admin/customer/SerchFilter';

export default function AdminCustomers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setCustomers(customerData);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Failed to load customers data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer: Customer) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (customer.name?.toLowerCase() || '').includes(searchLower) ||
      (customer.primaryContact?.toLowerCase() || '').includes(searchLower) ||
      (customer.id?.toString().toLowerCase() || '').includes(searchLower);
    const matchesStatus = statusFilter === 'all' || (customer.status?.toLowerCase() === statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', text: 'Active' },
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      inactive: { color: 'bg-gray-100 text-gray-800', text: 'Inactive' },
    };
    const config = statusConfig[status?.toLowerCase() as keyof typeof statusConfig] || statusConfig.inactive;
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>{config.text}</span>;
  };

  const getInvitationStatusBadge = (status: string) => {
    const statusConfig = {
      registered: { color: 'bg-green-100 text-green-800', text: 'Registered' },
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      expired: { color: 'bg-red-100 text-red-800', text: 'Expired' },
    };
    const config = statusConfig[status?.toLowerCase() as keyof typeof statusConfig] || statusConfig.pending;
    return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>{config.text}</span>;
  };

  const handleView = (customerId: string) => {
    navigate(`/admin/customers/${customerId}`);
  };

  const handleEdit = (customerId: string) => {
    navigate(`/admin/customers/edit/${customerId}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={'Error Loading Customers'} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Customer Management" backLink={'/admin/dashboard'} showBackButton isAddCustomer={true} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CustomerCards customers={customers} />
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <CustomerTable
          customers={filteredCustomers}
          getStatusBadge={getStatusBadge}
          getInvitationStatusBadge={getInvitationStatusBadge}
          onView={handleView}
          onEdit={handleEdit}
        />
        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <span className="mx-auto text-4xl text-gray-400">👥</span>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
        <CustomerManagementInfo />
      </div>
    </div>
  );
}
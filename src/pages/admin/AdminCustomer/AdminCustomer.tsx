import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Loading } from "../../../components/common/Loading";
import { Error } from "../../../components/common/Error";
import Header from "../../../components/common/Header";
import { CustomerCards } from "../../../components/admin/customer/CustomerCards";
import { CustomerTable } from "../../../components/admin/customer/CustomerTable";
import { CustomerManagementInfo } from "../../../components/admin/customer/CustomerManagementInfo";
import { SearchFilter } from "../../../components/admin/customer/SerchFilter";
import {
  fetchCustomersThunk,
  setSearchTerm,
  setStatusFilter,
} from "../../../redux/slices/customerSlice";
import { useAuth } from "../../../context/CognitoAuth";
import type { RootState, AppDispatch } from "../../../redux/store"; // Import AppDispatch

export default function AdminCustomers() {
  const dispatch = useDispatch<AppDispatch>(); // Use typed dispatch
  const navigate = useNavigate();
  const { token } = useAuth();
  const {
    customers,
    filteredCustomers,
    searchTerm,
    statusFilter,
    loading,
    error,
  } = useSelector((state: RootState) => state.customers);

  useEffect(() => {
    if (token) {
      dispatch(fetchCustomersThunk(token));
    } else {
      dispatch({
        type: "customers/fetchCustomers/rejected",
        payload: "No authentication token available",
      });
    }
  }, [dispatch, token]);

  const handleView = (customerId: number) => {
    navigate(`/admin/customers/${customerId}`);
  };

  const handleEdit = (customerId: number) => {
    navigate(`/admin/customers/edit/${customerId}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error || "Error Loading Customers"} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Customer Management"
        backLink={"/admin/dashboard"}
        showBackButton
        isAddCustomer={true}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CustomerCards customers={customers} />
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={(term: string) => dispatch(setSearchTerm(term))}
          statusFilter={statusFilter}
          setStatusFilter={(status: string) =>
            dispatch(setStatusFilter(status))
          }
        />
        <CustomerTable
          customers={filteredCustomers}
          onView={handleView}
          onEdit={handleEdit}
        />
        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <span className="mx-auto text-4xl text-gray-400">👥</span>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No customers found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
        <CustomerManagementInfo />
      </div>
    </div>
  );
}
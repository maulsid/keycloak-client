import type { AdminData } from '../../types';
import type { FC } from 'react';
import {
  CustomersIcon,
  ActiveCodesIcon,
  UtilizedCodesIcon,
  AvailableCodesIcon,
  CustomerManagementIcon,
  CreateCustomerIcon,
  ProvisionCodesIcon,
  PendingInvitationsIcon,
  AnalyticsIcon,
  SettingsIcon,
} from '../../components/admin/AdminIcons';

interface StatCard {
  title: string;
  value: (adminData: AdminData) => number;
  icon: FC;
  color: string;
}

interface ActionCard {
  title: string;
  description: string;
  link: string;
  icon: FC;
  iconColor: string;
}

export const statCards: StatCard[] = [
  {
    title: 'Total Customers',
    value: (adminData: AdminData) => adminData.totalCustomers,
    icon: CustomersIcon,
    color: 'text-orange-500',
  },
  {
    title: 'Active Codes',
    value: (adminData: AdminData) => adminData.totalAccessCodes,
    icon: ActiveCodesIcon,
    color: 'text-cyan-500',
  },
  {
    title: 'Utilized Codes',
    value: (adminData: AdminData) => adminData.utilizedCodes,
    icon: UtilizedCodesIcon,
    color: 'text-blue-500',
  },
  {
    title: 'Available Codes',
    value: (adminData: AdminData) => adminData.availableCodes,
    icon: AvailableCodesIcon,
    color: 'text-orange-500',
  },
];

export const actionCards: ActionCard[] = [
  {
    title: 'Customer Management',
    description: 'View and manage customer accounts',
    link: '/admin/customers',
    icon: CustomerManagementIcon,
    iconColor: 'text-orange-500 mb-2',
  },
  {
    title: 'Create Customer',
    description: 'Add new customer and generate invitation',
    link: '/admin/create-customer',
    icon: CreateCustomerIcon,
    iconColor: 'text-cyan-500 mb-2',
  },
  {
    title: 'Provision Codes',
    description: 'Add access codes to existing customers',
    link: '/admin/provision-codes',
    icon: ProvisionCodesIcon,
    iconColor: 'text-blue-500 mb-2',
  },
  {
    title: 'Pending Invitations',
    description: 'Manage customer invitations',
    link: '/admin/invitations',
    icon: PendingInvitationsIcon,
    iconColor: 'text-orange-500 mb-2',
  },
  {
    title: 'Analytics',
    description: 'View usage statistics and reports',
    link: '/admin/analytics',
    icon: AnalyticsIcon,
    iconColor: 'text-red-600 mb-2',
  },
  {
    title: 'Settings',
    description: 'Configure portal settings',
    link: '/admin/settings',
    icon: SettingsIcon,
    iconColor: 'text-gray-600 mb-2',
  },
];
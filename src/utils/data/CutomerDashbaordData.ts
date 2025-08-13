import type { FC } from 'react';
import type { CustomerData } from '../../types';
import {
  CustomerIdIcon,
  AvailableCodesIcon,
  UtilizedCodesIcon,
  TotalPurchasedIcon,
  AccessCodesIcon,
  RequestCodeIcon,
  MarketingIcon,
  PatientReportsIcon,
} from '../../components/customer/CustomerIcons';

interface StatCard {
  title: string;
  value: (customerData: CustomerData) => number | string;
  icon: FC;
  iconColor: string; 
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
    title: 'Customer ID',
    value: (customerData) => customerData.customerId,
    icon: CustomerIdIcon,
    iconColor: 'text-orange-500',
  },
  {
    title: 'Available Codes',
    value: (customerData) => customerData.availableCodes,
    icon: AvailableCodesIcon,
    iconColor: 'text-cyan-500',
  },
  {
    title: 'Utilized Codes',
    value: (customerData) => customerData.utilizedCodes,
    icon: UtilizedCodesIcon,
    iconColor: 'text-blue-500',
  },
  {
    title: 'Total Purchased',
    value: (customerData) => customerData.purchasedCodes,
    icon: TotalPurchasedIcon,
    iconColor: 'text-orange-500',
  },
];

export const actionCards: ActionCard[] = [
  {
    title: 'Access Codes',
    description: 'View and manage your codes',
    link: '/customer/access-codes',
    icon: AccessCodesIcon,
    iconColor: 'text-blue-500 mb-2',
  },
  {
    title: 'Request Code',
    description: 'Get new access code',
    link: '/customer/request-code',
    icon: RequestCodeIcon,
    iconColor: 'text-cyan-500 mb-2',
  },
  {
    title: 'Marketing',
    description: 'Download materials',
    link: '/customer/marketing',
    icon: MarketingIcon,
    iconColor: 'text-blue-500 mb-2',
  },
  {
    title: 'Patient Reports',
    description: 'View treatment data',
    link: '/customer/patient-reports',
    icon: PatientReportsIcon,
    iconColor: 'text-orange-500 mb-2',
  },
];
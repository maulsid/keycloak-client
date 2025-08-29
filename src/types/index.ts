import type { FC, JSX, SVGProps } from "react";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
}

export interface UserState {
  users: User[];
  filteredUsers: User[];
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  loading: boolean;
  error: string | null;
}

export interface LoginFeatureCardProps {
  bgColor: string;
  textColor: string;
  borderColor: string;
  title: string;
  description: string;
}
export interface LoginPortalCardProps {
  title: string;
  icon: JSX.Element;
  description: string;
  features: LoginFeatureCardProps[];
  buttonText: string;
  buttonLink: string;
  buttonColor: string;
}

export interface AdminStatCardProps {
  title: string;
  value: number;
  icon: FC;
}
export interface AdminActionCardProps {
  title: string;
  description: string;
  link: string;
  icon: FC;
  iconColor: string;
}
export interface Code {
  code_id: number;
  code: string;
  status: 'assigned' | 'available' | 'utilized'; 
  order_id: number;
}

export interface AdminAlertBannerProps {
  pendingInvitations: number;
}

export interface AdminActivityItemProps {
  action: string;
  customerName: string;
  date: string;
}

export interface AdminData {
  totalCustomers: number;
  activeCustomers: number;
  totalAccessCodes: number;
  utilizedCodes: number;
  availableCodes: number;
  pendingInvitations: number;
  recentActivity: Array<{
    id: number;
    action: string;
    customerName: string;
    date: string;
    status: string;
  }>;
}
export interface CustomerHeaderProps {
  primaryContact: string;
}

export interface CustomerData {
  customerId: string;
  name: string;
  primaryContact: string;
  email: string;
  phone: string;
  purchasedCodes: number;
  utilizedCodes: number;
  availableCodes: number;
  recentActivity: Array<{
    id: number;
    action: string;
    patientId?: string;
    date: string;
    status: string;
  }>;
}
export interface CustomerStatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  iconColor: string;
}

export interface CustomerInfoProps {
  customerData: CustomerData;
}

export interface CustomerActionCardProps {
  title: string;
  description: string;
  link: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  iconColor: string;
}

export interface CustomerActivityItemProps {
  action: string;
  patientId?: string;
  date: string;
}

export interface AccessCodeHeaderProps {
  user: { id: string } | null;
}

export interface AccessCodeFilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export interface AccessCodeStatCardProps {
  title: string;
  value: number;
  icon: JSX.Element;
  iconColor: string;
}

export interface AccessCodeStatusBadgeProps {
  status: string;
}

export interface AccessCodeEmptyStateProps {
  message: string;
}

export interface AccessCodeRowProps {
  code: AccessCode;
}

export interface AccessCode {
  id: string;
  code: string;
  status: string;
  patientId?: string;
  patientName?: string;
  utilizationDate?: string;
  assignedDate?: string;
}
export interface CommonHeaderProps {
  title: string;
  primaryContact?: string;
  showBackButton?: boolean;
  showActionButtons?: boolean;
  isSettings?: boolean;
  isAddCustomer?: boolean;
  backLink?: string;
}

export interface Customer {
  customer_id: number;
  name: string;
  customer_type: string;
  organization_id: number | null;
  organization_name: string | null;
  total_codes_ordered: number;
  codes_utilized: number;
  codes_available: number;
  user_count: number;
  created_at: string;
  status?:string;
  totalCodes?:string;
}
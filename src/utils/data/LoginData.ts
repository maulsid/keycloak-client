import type { LoginFeatureCardProps } from "../../types";

  export const customerFeatures: LoginFeatureCardProps[] = [
    {
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-900',
      borderColor: 'border border-orange-200',
      title: 'Dashboard Overview',
      description: 'View customer details, access code summary, and account information',
    },
    {
      bgColor: 'bg-cyan-100',
      textColor: 'text-cyan-900',
      borderColor: 'border border-cyan-200',
      title: 'Access Code Management',
      description: 'Request new codes and view your inventory',
    },
    {
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-900',
      borderColor: 'border border-blue-200',
      title: 'Marketing Materials',
      description: 'Download approved promotional materials',
    },
    {
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-900',
      borderColor: 'border border-orange-200',
      title: 'Patient Reports',
      description: 'Review treatment progress and data',
    },
  ];

  export const adminFeatures: LoginFeatureCardProps[] = [
    {
      bgColor: 'bg-red-50',
      textColor: 'text-red-900',
      borderColor: '',
      title: 'Customer Management',
      description: 'Create new customers and manage existing accounts',
    },
    {
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-900',
      borderColor: '',
      title: 'Access Code Provisioning',
      description: 'Add access codes to customer inventories',
    },
    {
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-900',
      borderColor: '',
      title: 'Invitation System',
      description: 'Generate unique registration links for customers',
    },
    {
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-900',
      borderColor: '',
      title: 'Account Administration',
      description: 'Monitor and manage portal access',
    },
  ];
import type { IconType } from "react-icons";
import {
  HiCheckCircle,
  HiDocumentReport,
  HiExclamationCircle,
  HiIdentification,
  HiKey,
  HiPlusCircle,
  HiShoppingCart,
  HiSpeakerphone,
} from "react-icons/hi";
import type { CustomerData } from "../../types";

export interface StatCard {
  title: string;
  value: (customerData: CustomerData) => number | string;
  icon: IconType;
  iconColor: string;
}

export interface ActionCard {
  title: string;
  description: string;
  link: string;
  icon: IconType;
  iconColor: string;
}

export const statCards: StatCard[] = [
  {
    title: "Customer ID",
    value: (customerData) => customerData.customerId,
    icon: HiIdentification,
    iconColor: "text-orange-500",
  },
  {
    title: "Available Codes",
    value: (customerData) => customerData.availableCodesCount,
    icon: HiCheckCircle,
    iconColor: "text-cyan-500",
  },
  {
    title: "Utilized Codes",
    value: (customerData) => customerData.utilizedCodesCount,
    icon: HiExclamationCircle,
    iconColor: "text-blue-500",
  },
  {
    title: "Total Purchased",
    value: (customerData) => customerData.totalPurchasedCodes,
    icon: HiShoppingCart,
    iconColor: "text-orange-500",
  },
];

export const actionCards: ActionCard[] = [
  {
    title: "Access Codes",
    description: "View and manage your codes",
    link: "/customer/access-codes",
    icon: HiKey,
    iconColor: "text-blue-500 mb-2",
  },
  {
    title: "Request Code",
    description: "Get new access code",
    link: "/customer/request-code",
    icon: HiPlusCircle,
    iconColor: "text-cyan-500 mb-2",
  },
  {
    title: "Marketing",
    description: "Download materials",
    link: "/customer/marketing",
    icon: HiSpeakerphone,
    iconColor: "text-blue-500 mb-2",
  },
  {
    title: "Patient Reports",
    description: "View treatment data",
    link: "/customer/patient-reports",
    icon: HiDocumentReport,
    iconColor: "text-orange-500 mb-2",
  },
];

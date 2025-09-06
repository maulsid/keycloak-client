import React from "react";
import { FiUser, FiPhone, FiKey, FiSend } from "react-icons/fi";
import type { AccessCode, AssignCodeForm } from "../../../types";
import { useNavigate } from "react-router-dom";

interface PatientFormProps {
    formData: AssignCodeForm;
    setFormData: React.Dispatch<React.SetStateAction<AssignCodeForm>>;
    availableCodes: AccessCode[];
    isSubmitting: boolean;
    setShowConfirmation: React.Dispatch<React.SetStateAction<boolean>>;
}

const PatientForm: React.FC<PatientFormProps> = ({
    formData,
    setFormData,
    availableCodes,
    isSubmitting,
    setShowConfirmation,
}) => {
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const navigate = useNavigate();

    const formatPhoneNumber = (value: string) => {
        const digits = value.replace(/\D/g, "");
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            patientMobile: formatPhoneNumber(e.target.value),
        }));
    };

    const validateForm = () => {
        if (!formData.patientFirstName.trim()) return false;
        if (!formData.patientMobile.trim()) return false;
        if (!formData.selectedCode) return false;
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setShowConfirmation(true);
        }
    };


    return (
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Patient Information</h2>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
                <div>
                    <label htmlFor="patientFirstName" className="block text-sm font-medium text-gray-700">
                        Patient First Name *
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="patientFirstName"
                            id="patientFirstName"
                            value={formData.patientFirstName}
                            onChange={handleInputChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter patient's first name"
                            required
                        />
                    </div>
                </div>

                {/* Phone */}
                <div>
                    <label htmlFor="patientMobile" className="block text-sm font-medium text-gray-700">
                        Patient Mobile Number *
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiPhone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="tel"
                            name="patientMobile"
                            id="patientMobile"
                            value={formData.patientMobile}
                            onChange={handlePhoneChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="(555) 123-4567"
                            maxLength={14}
                            required
                        />
                    </div>
                </div>

                {/* Select Code */}
                <div>
                    <label htmlFor="selectedCode" className="block text-sm font-medium text-gray-700">
                        Select Access Code *
                    </label>
                    <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiKey className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            name="selectedCode"
                            id="selectedCode"
                            value={formData.selectedCode}
                            onChange={handleInputChange}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">Select an available access code</option>
                            {availableCodes.map((code) => (
                                <option key={code.id} value={code.code}>
                                    {code.code} (Assigned: {code.assignedDate})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3">
                    <span onClick={() => navigate('/customer/access-codes')} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >Cancel</span>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Assigning...
                            </>
                        ) : (
                            <>
                                <FiSend className="h-4 w-4 mr-2" />
                                Review & Assign Code
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PatientForm;

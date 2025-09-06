import React from "react";
import { FiSend } from "react-icons/fi";
import type { AssignCodeForm } from "../../../types";

interface ConfirmationModalProps {
  formData: AssignCodeForm;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  formData,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-md shadow-lg w-96">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100">
            <FiSend className="h-6 w-6 text-orange-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mt-4">Confirm Assignment</h3>
          <p className="text-sm text-gray-500 mt-2">
            Are you sure you want to assign access code{" "}
            <strong className="font-mono">{formData.selectedCode}</strong> to{" "}
            <strong>{formData.patientFirstName}</strong>?
          </p>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-700">
              <strong>SMS will be sent to:</strong> {formData.patientMobile}
            </p>
          </div>
          <div className="flex justify-center space-x-3 mt-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Confirm & Send SMS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

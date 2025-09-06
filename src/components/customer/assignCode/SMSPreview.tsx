import React from "react";
import type { AssignCodeForm } from "../../../types";

interface SMSPreviewProps {
  formData: AssignCodeForm;
}

const SMSPreview: React.FC<SMSPreviewProps> = ({ formData }) => {
  const message = `Hi ${formData.patientFirstName}, your Rejoyn access code is: ${formData.selectedCode}. Use this code to access your treatment program. If you have any questions, please contact your healthcare provider.`;

  return (
    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
      <h3 className="text-sm font-medium text-blue-900 mb-2">SMS Preview</h3>
      <div className="bg-white border border-blue-300 rounded-md p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">To: {formData.patientMobile}</span>
          <span className="text-xs text-gray-500">SMS</span>
        </div>
        <p className="text-sm text-gray-700">{message}</p>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Message length: {message.length} characters
          </p>
        </div>
      </div>
    </div>
  );
};

export default SMSPreview;

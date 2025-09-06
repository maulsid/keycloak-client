import React from "react";
import { FiAlertCircle } from "react-icons/fi";

const InfoBox: React.FC = () => {
  return (
    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
      <div className="flex">
        <FiAlertCircle className="h-5 w-5 text-blue-400" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">Important Information</h3>
          <ul className="list-disc list-inside space-y-1 mt-2 text-sm text-blue-700">
            <li>The access code will be immediately assigned to the patient</li>
            <li>An SMS message will be sent to the provided mobile number</li>
            <li>The patient can use this code to access their Rejoyn treatment program</li>
            <li>You can track the patient's progress in the Patient Reports section</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;

import React from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import type { AssignCodeForm } from "../../../types";

interface SubmitStatusAlertProps {
  status: "idle" | "success" | "error";
  errorMessage: string;
  formData: AssignCodeForm;
}

const SubmitStatusAlert: React.FC<SubmitStatusAlertProps> = ({
  status,
  errorMessage,
  formData,
}) => {
  console.log("status", formData);
  
  if (status === "success") {
    return (
      <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
        <div className="flex">
          <FiCheckCircle className="h-5 w-5 text-green-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Access Code Assigned Successfully!
            </h3>
            {/* <div className="mt-2 text-sm text-green-700">
              <p><strong>Patient:</strong> {formData.patientFirstName}</p>
              <p><strong>Mobile:</strong> {formData.patientMobile}</p>
              <p>
                <strong>Access Code:</strong>{" "}
                <span className="font-mono">{formData.selectedCode}</span>
              </p>
              <p className="mt-2">
                An SMS message has been sent to the patient with their access code.
              </p>
            </div> */}
          </div>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <FiXCircle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error Assigning Access Code
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{errorMessage}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SubmitStatusAlert;

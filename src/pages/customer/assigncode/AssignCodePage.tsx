import React, { useState, useEffect } from 'react';
import Header from '../../../components/common/Header';
import { Loading } from '../../../components/common/Loading';
import { Error } from '../../../components/common/Error';
import type { AssignCodeForm, AccessCode } from '../../../types';
import SubmitStatusAlert from '../../../components/customer/assignCode/SubmitStatusAlert';
import PatientForm from '../../../components/customer/assignCode/PatientForm';
import SMSPreview from '../../../components/customer/assignCode/SMSPreview';
import InfoBox from '../../../components/customer/assignCode/InfoBox';
import ConfirmationModal from '../../../components/customer/assignCode/ConfirmationModal';
import { useAppSelector } from "../../../redux/redux-hooks";
import { useAuth } from '../../../context/CognitoAuth';

// Function to normalize mobile number to +<countrycode><digits> format
const normalizeMobileNumber = (mobile: string): string => {
  // Remove all non-digit characters except the leading +
  let cleaned = mobile.replace(/[^\d+]/g, '');
  
  // If no + is present, assume +1 (US country code) as default
  if (!cleaned.startsWith('+')) {
    cleaned = `+1${cleaned}`;
  }

  // Ensure the number is 11 or 12 digits (e.g., +11234567890)
  const digits = cleaned.replace('+', '');
  if (digits.length !== 10 && digits.length !== 11) {
    throw console.log('Invalid mobile number length. Expected 10 or 11 digits.');
  }

  return cleaned;
};

const AssignCodePage: React.FC = () => {
  const {
    loading: initialLoading,
  } = useAppSelector((state) => state.codes);

  const { customerId, token, idToken } = useAuth(); // Access idToken for additional validation

  const [formData, setFormData] = useState<AssignCodeForm>({
    patientFirstName: '',
    patientMobile: '',
    selectedCode: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [availableCodes, setAvailableCodes] = useState<AccessCode[]>([]);
  const [preSelectedCode, setPreSelectedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(initialLoading);
  const [isReady, setIsReady] = useState(false); // New state to wait for customerId

  // Handle pre-selected code
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPreSelectedCode(params.get('code'));
  }, []);

  // Fetch available codes from API
  useEffect(() => {
    const fetchAvailableCodes = async () => {
      setLoading(true);
      try {
        if (!customerId) {
          setErrorMessage('Unable to retrieve customer ID.');
          setLoading(false);
          return;
        }
        console.log('Customer ID:', customerId); // Debug log

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}portal/hcp/customer/${customerId}/codes/available`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        if (!response.ok) {
          console.log("API Error:", response);
          setErrorMessage(`API Error: ${response.status} - ${response.statusText}`);
          return;
        }

        // Map the API response to include assignedDate with current date
        const codes = data.codes?.map((c: any, index: number) => ({
          id: index.toString(), // Generate a temporary id since code_id is missing
          code: c.code,
          status: 'unassigned', // Default status since not provided
          assignedDate: new Date().toISOString(), // Current date and time (11:14 PM IST, 2025-09-09T17:44:00Z)
        })) || [];
        setAvailableCodes(codes);
      } catch (err) {
        setErrorMessage('Failed to process available codes.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableCodes();
  }, [customerId, token]);

  // Handle pre-selection
  useEffect(() => {
    if (preSelectedCode && availableCodes.length > 0) {
      const code = availableCodes.find((c) => c.code === preSelectedCode);
      if (code) {
        setFormData((prev) => ({ ...prev, selectedCode: code.code }));
      }
    }
  }, [preSelectedCode, availableCodes]);

  // Set isReady when customerId and idToken are available
  useEffect(() => {
    if (customerId && idToken) {
      setIsReady(true);
    }
  }, [customerId, idToken]);

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setShowConfirmation(false);

    try {
      // Normalize the patientMobile to ensure it’s in +<digits> format
      const formattedMobile = normalizeMobileNumber(formData.patientMobile);
      console.log('Sending payload:', {
        patientFirstName: formData.patientFirstName,
        patientMobileNumber: formattedMobile,
      }); // Debug log

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}portal/hcp/codes/${formData?.selectedCode}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add token for authentication
        },
        body: JSON.stringify({
          patientFirstName: formData.patientFirstName,
          patientMobileNumber: formattedMobile, // Use normalized mobile number
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.log("API Error:", response.ok, result);
        setErrorMessage(`API Error: ${response.status} - ${response.statusText}`);
      } else {
        setSubmitStatus('success');
        setFormData({ patientFirstName: '', patientMobile: '', selectedCode: '' });
      }
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || 'An error occurred while assigning the code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReady) return <Loading />; // Wait for customerId and idToken
  if (loading) return <Loading />;
  if ( errorMessage) return <Error message={errorMessage} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Assign Code" backLink="/customer/access-codes" showBackButton isAssignCodeInfo />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SubmitStatusAlert status={submitStatus} errorMessage={errorMessage} formData={formData} />

        <PatientForm
          formData={formData}
          setFormData={setFormData}
          availableCodes={availableCodes}
          isSubmitting={isSubmitting}
          setShowConfirmation={setShowConfirmation}
        />

        {formData.patientFirstName && formData.patientMobile && formData.selectedCode && (
          <SMSPreview formData={formData} />
        )}

        <InfoBox />
      </div>

      {showConfirmation && (
        <ConfirmationModal
          formData={formData}
          onCancel={() => setShowConfirmation(false)}
          onConfirm={handleConfirmSubmit}
        />
      )}
    </div>
  );
};

export default AssignCodePage;
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

const AssignCodePage: React.FC = () => {
  const {
    filteredCodes,
    loading,
    error,
  } = useAppSelector((state) => state.codes);

  // const [user, setUser] = useState<AssignUser | null>({ id: 'mock-user-id' });
  // const [authLoading, setAuthLoading] = useState(false);
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

  // Handle pre-selected code
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPreSelectedCode(params.get('code'));
  }, []);

  // Map filteredCodes to availableCodes, showing only null or unassigned status
  useEffect(() => {
    if (filteredCodes) {
      try {
        const codes = filteredCodes
          .filter((c: any) => c.status === null || c.status === 'unassigned') // Filter for null or unassigned
          .map((c: any) => ({
            id: c.code_id.toString(), // Convert code_id to string to match AccessCode type
            code: c.code,
            status: c.status || 'unassigned', // Normalize null to 'unassigned' for consistency
            assignedDate: new Date().toISOString().split('T')[0], // Placeholder; adjust if you have a date field
          }));
        setAvailableCodes(codes);
      } catch (err) {
        setErrorMessage('Failed to process available codes.');
      }
    }
  }, [filteredCodes]);

  // Handle pre-selection
  useEffect(() => {
    if (preSelectedCode && availableCodes.length > 0) {
      const code = availableCodes.find((c) => c.code === preSelectedCode);
      if (code) {
        setFormData((prev) => ({ ...prev, selectedCode: code.code }));
      }
    }
  }, [preSelectedCode, availableCodes]);

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setShowConfirmation(false);
    try {
      await new Promise((res) => setTimeout(res, 2000));
      setSubmitStatus('success');
      setFormData({ patientFirstName: '', patientMobile: '', selectedCode: '' });
    } catch {
      setSubmitStatus('error');
      setErrorMessage('Failed to assign code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if ( loading) return <Loading />;
  if (error || errorMessage) return <Error message={error || errorMessage} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Assign Access Code" backLink="/customer/access-codes" showBackButton isAssignCodeInfo />
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
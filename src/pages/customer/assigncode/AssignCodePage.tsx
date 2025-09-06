import React, { useState, useEffect } from 'react';
import Header from '../../../components/common/Header';
import { Loading } from '../../../components/common/Loading';
import { Error } from '../../../components/common/Error';

import type { AssignCodeForm, AccessCode, AssignUser } from '../../../types';
import SubmitStatusAlert from '../../../components/customer/assignCode/SubmitStatusAlert';
import PatientForm from '../../../components/customer/assignCode/PatientForm';
import SMSPreview from '../../../components/customer/assignCode/SMSPreview';
import InfoBox from '../../../components/customer/assignCode/InfoBox';
import ConfirmationModal from '../../../components/customer/assignCode/ConfirmationModal';

const AssignCodePage: React.FC = () => {
  const [user, setUser] = useState<AssignUser | null>({ id: 'mock-user-id' });
  const [authLoading, setAuthLoading] = useState(false);
  const [formData, setFormData] = useState<AssignCodeForm>({
    patientFirstName: '',
    patientMobile: '',
    selectedCode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [availableCodes, setAvailableCodes] = useState<AccessCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [preSelectedCode, setPreSelectedCode] = useState<string | null>(null);

  // Handle pre-selected code
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPreSelectedCode(params.get('code'));
  }, []);

  // Fetch available codes (mock)
  useEffect(() => {
    const fetchCodes = async () => {
      if (!user) return setLoading(false);
      try {
        setLoading(true);
        const mockResponse = {
          status: 'success',
          data: [
            { id: '1', code: 'ABC123', customerId: user.id, status: 'available', createdAt: '2024-01-01T00:00:00Z' },
            { id: '2', code: 'DEF456', customerId: user.id, status: 'available', createdAt: '2024-01-02T00:00:00Z' }
          ]
        };
        const codes = mockResponse.data.filter((c: any) => c.customerId === user.id && c.status === 'available');
        setAvailableCodes(
          codes.map((c: any) => ({
            id: c.id,
            code: c.code,
            status: 'available',
            assignedDate: new Date(c.createdAt).toISOString().split('T')[0]
          }))
        );
      } catch (err) {
        setErrorMessage('Failed to load available codes.');
      } finally {
        setLoading(false);
      }
    };
    fetchCodes();
  }, [user]);

  // Handle pre-selection
  useEffect(() => {
    if (preSelectedCode && availableCodes.length > 0) {
      const code = availableCodes.find(c => c.code === preSelectedCode);
      if (code) {
        setFormData(prev => ({ ...prev, selectedCode: code.code }));
      }
    }
  }, [preSelectedCode, availableCodes]);

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setShowConfirmation(false);
    try {
      await new Promise(res => setTimeout(res, 2000));
      setSubmitStatus('success');
      setFormData({ patientFirstName: '', patientMobile: '', selectedCode: '' });
    } catch {
      setSubmitStatus('error');
      setErrorMessage('Failed to assign code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) return <Loading />;
  if (errorMessage && !isSubmitting) return <Error message={errorMessage} />;
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please <a href="/login" className="underline">log in</a> to assign codes.</p>
      </div>
    );
  }

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

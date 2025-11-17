'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export default function KYCPage() {
  const [kycStatus, setKycStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    doc_type: 'AADHAAR',
    doc_number: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadKYCStatus();
  }, []);

  const loadKYCStatus = async () => {
    try {
      const result = await apiClient.getKYCStatus();
      if (result.success) {
        setKycStatus(result.data || []);
      }
    } catch (error) {
      console.error('Failed to load KYC status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.doc_number.trim()) {
      setError('Please enter document number');
      return;
    }

    setSubmitting(true);

    try {
      const result = await apiClient.submitKYC({
        doc_type: formData.doc_type,
        doc_number: formData.doc_number,
      });

      if (result.success) {
        setSuccess('KYC document submitted successfully! It will be verified soon.');
        setFormData({ doc_type: 'AADHAAR', doc_number: '' });
        setShowForm(false);
        loadKYCStatus();
      } else {
        setError(result.error || 'Failed to submit KYC document');
      }
    } catch (err) {
      setError('An error occurred while submitting KYC document');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'danger';
      default:
        return 'default';
    }
  };

  const hasVerifiedDocument = kycStatus.some(
    (doc) => doc.verification_status === 'VERIFIED'
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading KYC status...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">KYC Verification</h1>
          <p className="text-gray-600 mt-1">
            Complete your KYC to unlock all features
          </p>
        </div>

        {/* KYC Status Banner */}
        {hasVerifiedDocument ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-green-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-green-900">KYC Verified</h3>
                <p className="text-sm text-green-700">
                  Your identity has been verified successfully
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-6 h-6 text-yellow-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-yellow-900">
                  KYC Verification Required
                </h3>
                <p className="text-sm text-yellow-700">
                  Please complete KYC verification to use all features
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Submit New Document */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Submit KYC Document</CardTitle>
              {!showForm && (
                <Button onClick={() => setShowForm(true)}>Add Document</Button>
              )}
            </div>
          </CardHeader>
          {showForm && (
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Select
                  label="Document Type"
                  value={formData.doc_type}
                  onChange={(e) =>
                    setFormData({ ...formData, doc_type: e.target.value })
                  }
                  options={[
                    { value: 'AADHAAR', label: 'Aadhaar Card' },
                    { value: 'PAN', label: 'PAN Card' },
                    { value: 'PASSPORT', label: 'Passport' },
                    { value: 'DRIVING_LICENSE', label: 'Driving License' },
                    { value: 'VOTER_ID', label: 'Voter ID' },
                  ]}
                  fullWidth
                />

                <Input
                  label="Document Number"
                  type="text"
                  placeholder="Enter document number"
                  value={formData.doc_number}
                  onChange={(e) =>
                    setFormData({ ...formData, doc_number: e.target.value })
                  }
                  required
                  fullWidth
                />

                <div className="flex gap-3">
                  <Button type="submit" fullWidth disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Document'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setShowForm(false);
                      setError('');
                    }}
                    fullWidth
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          )}
        </Card>

        {/* Submitted Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Submitted Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {kycStatus.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No documents submitted yet
              </p>
            ) : (
              <div className="space-y-3">
                {kycStatus.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-medium text-gray-900">
                          {doc.doc_type.replace(/_/g, ' ')}
                        </p>
                        <Badge variant={getStatusBadgeVariant(doc.verification_status)}>
                          {doc.verification_status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Document Number: {doc.doc_number}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted: {new Date(doc.created_at).toLocaleString()}
                      </p>
                      {doc.verified_at && (
                        <p className="text-xs text-gray-500">
                          Verified: {new Date(doc.verified_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Why is KYC verification required?
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Verify your identity and build trust in the platform
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Comply with regulatory requirements
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Unlock higher loan limits and better interest rates
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Protect against fraud and maintain platform security
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

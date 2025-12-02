'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

interface KYCDocument {
  id: string;
  doc_type: string;
  doc_number: string;
  status: string;
  created_at: string;
  verified_at?: string;
}

export default function KYCPage() {
  const [kycStatus, setKycStatus] = useState<{ has_verified_kyc: boolean; documents: KYCDocument[] }>({ has_verified_kyc: false, documents: [] });
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
        const data = result.data;
        console.log('KYC Status Data:', data);
        setKycStatus(data);
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
        setSuccess('Document submitted successfully! It will be verified soon.');
        setFormData({ doc_type: 'AADHAAR', doc_number: '' });
        setShowForm(false);
        loadKYCStatus();
      } else {
        setError(result.error || 'Failed to submit document');
      }
    } catch {
      setError('An error occurred while submitting');
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

  const hasVerifiedDocument = kycStatus.has_verified_kyc;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-primary-100 border-t-primary rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading KYC status...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">KYC Verification</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Complete your identity verification to unlock all features
          </p>
        </div>

        {/* Status Banner */}
        {hasVerifiedDocument ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">KYC Verified</h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  Your identity has been verified successfully
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">Verification Required</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Please complete KYC to access all features
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-xl text-sm animate-scaleIn">
            {success}
          </div>
        )}

        {/* Submit Document Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle size="sm">Submit Document</CardTitle>
                <CardDescription>Add a new identity document for verification</CardDescription>
              </div>
              {!showForm && (
                <Button onClick={() => setShowForm(true)} size="sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </Button>
              )}
            </div>
          </CardHeader>
          {showForm && (
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm animate-scaleIn">
                    {error}
                  </div>
                )}

                <Select
                  label="Document Type"
                  value={formData.doc_type}
                  onChange={(e) => setFormData({ ...formData, doc_type: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, doc_number: e.target.value })}
                  required
                  fullWidth
                />

                <div className="flex gap-3 pt-2">
                  <Button type="submit" fullWidth disabled={submitting} loading={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Document'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
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
            <CardTitle size="sm">Submitted Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {kycStatus.documents.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">No documents submitted yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {kycStatus.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {doc.doc_type.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {doc.doc_number}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {new Date(doc.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(doc.status)} size="sm">
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/50">
          <CardContent className="p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Why is KYC required?
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Verify your identity and build trust
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Comply with regulatory requirements
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Unlock higher loan limits and better rates
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Protect against fraud
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

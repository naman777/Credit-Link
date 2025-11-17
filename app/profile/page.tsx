'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/lib/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function ProfilePage() {
  const { user } = useAuth();
  const [creditScore, setCreditScore] = useState<any>(null);
  const [kycStatus, setKycStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const [creditRes, kycRes] = await Promise.all([
        apiClient.getCreditScore(),
        apiClient.getKYCStatus(),
      ]);

      if (creditRes.success) setCreditScore(creditRes.data);
      if (kycRes.success) setKycStatus(kycRes.data || []);
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasVerifiedKYC = kycStatus.some(
    (doc) => doc.verification_status === 'VERIFIED'
  );

  const getCreditScoreColor = (score: number) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCreditScoreLabel = (score: number) => {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    return 'Poor';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">View your account information and credit score</p>
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Full Name</p>
                <p className="text-lg font-medium text-gray-900">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="text-lg font-medium text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone</p>
                <p className="text-lg font-medium text-gray-900">{user?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Role</p>
                <Badge variant="info" className="text-base px-3 py-1">
                  {user?.role}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Account Status</p>
                <Badge
                  variant={user?.status === 'ACTIVE' ? 'success' : 'danger'}
                  className="text-base px-3 py-1"
                >
                  {user?.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">KYC Status</p>
                <Badge
                  variant={hasVerifiedKYC ? 'success' : 'warning'}
                  className="text-base px-3 py-1"
                >
                  {hasVerifiedKYC ? 'Verified' : 'Not Verified'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Score */}
        <Card>
          <CardHeader>
            <CardTitle>Credit Score</CardTitle>
          </CardHeader>
          <CardContent>
            {creditScore ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div
                    className={`text-6xl font-bold ${getCreditScoreColor(
                      creditScore.score
                    )}`}
                  >
                    {creditScore.score}
                  </div>
                  <p className="text-xl text-gray-600 mt-2">
                    {getCreditScoreLabel(creditScore.score)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Last updated: {new Date(creditScore.last_updated).toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {creditScore.total_loans_taken}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Total Loans</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {creditScore.on_time_payments}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">On-Time Payments</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-yellow-600">
                      {creditScore.late_payments}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Late Payments</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {creditScore.defaults_count}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Defaults</p>
                  </div>
                </div>

                {/* Credit Score Tips */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    How to improve your credit score:
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5"
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
                      Make all payments on time
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5"
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
                      Pay more than the minimum amount due
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5"
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
                      Avoid taking multiple loans at once
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5"
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
                      Complete your KYC verification
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No credit score data available yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  Your credit score will be generated after your first loan activity
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Account Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium text-gray-900">
                  {user ? new Date(user.created_at).toLocaleDateString() : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium text-gray-900">
                  {user ? new Date(user.updated_at).toLocaleDateString() : '-'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

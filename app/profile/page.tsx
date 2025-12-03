'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/lib/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface CreditScoreData {
  score: number;
  total_loans_taken: number;
  on_time_payments: number;
  late_payments: number;
  defaults_count: number;
  last_updated: string;
}

interface KYCDocument {
  verification_status: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [creditScore, setCreditScore] = useState<CreditScoreData | null>(null);
  const [kycStatus, setKycStatus] = useState<KYCDocument[]>([]);
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
      if (kycRes.success) {
        const kycData = kycRes.data.documents;
        setKycStatus(Array.isArray(kycData) ? kycData : []);
      }
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
    if (score >= 750) return 'text-success';
    if (score >= 650) return 'text-warning';
    return 'text-danger';
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
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-primary-100 border-t-primary rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View your account information and credit score
          </p>
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle size="sm">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Full Name</p>
                <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">{user?.name}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</p>
                <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">{user?.email}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Phone</p>
                <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white">{user?.phone}</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Role</p>
                <div className="mt-1">
                  <Badge variant="info" size="sm">{user?.role}</Badge>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Account Status</p>
                <div className="mt-1">
                  <Badge variant={user?.status === 'ACTIVE' ? 'success' : 'danger'} size="sm">
                    {user?.status}
                  </Badge>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">KYC Status</p>
                <div className="mt-1">
                  <Badge variant={hasVerifiedKYC ? 'success' : 'warning'} size="sm">
                    {hasVerifiedKYC ? 'Verified' : 'Not Verified'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credit Score */}
        <Card>
          <CardHeader>
            <CardTitle size="sm">Credit Score</CardTitle>
          </CardHeader>
          <CardContent>
            {creditScore ? (
              <div className="space-y-6">
                <div className="text-center py-4">
                  <div className={`text-5xl font-bold ${getCreditScoreColor(creditScore.score)}`}>
                    {creditScore.score}
                  </div>
                  <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mt-2">
                    {getCreditScoreLabel(creditScore.score)}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {creditScore.total_loans_taken}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total Loans</p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {creditScore.on_time_payments}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">On-Time</p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {creditScore.late_payments}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Late</p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {creditScore.defaults_count}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Defaults</p>
                  </div>
                </div>

                {/* Credit Score Tips */}
                <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Improve your score
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Make all payments on time
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Pay more than minimum due
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Avoid multiple loans at once
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">No credit score data yet</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Score generated after first loan activity
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Activity */}
        <Card>
          <CardHeader>
            <CardTitle size="sm">Account Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Member Since</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }) : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.updated_at ? new Date(user.updated_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }) : '-'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

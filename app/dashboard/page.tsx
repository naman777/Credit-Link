'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface WalletData {
  current_balance: string | number;
}

interface CreditScoreData {
  score: number;
  on_time_payments: number;
  late_payments: number;
}

interface LoanApplication {
  id: string;
  requested_amount: string | number;
  status: string;
  purpose?: string;
  created_at: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [creditScore, setCreditScore] = useState<CreditScoreData | null>(null);
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [walletRes, creditRes, loansRes] = await Promise.all([
        apiClient.getWalletBalance(),
        apiClient.getCreditScore(),
        apiClient.getLoanApplications(),
      ]);

      if (walletRes.success) setWallet(walletRes.data);
      if (creditRes.success) setCreditScore(creditRes.data);
      if (loansRes.success) {
        const loansData = loansRes.data?.applications || loansRes.data;
        setLoanApplications(Array.isArray(loansData) ? loansData : []);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'VERIFIED':
      case 'PAID':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
      case 'OVERDUE':
        return 'danger';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-primary-100 border-t-primary rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fadeIn">
        {/* Welcome Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-tertiary rounded-2xl p-6 md:p-8 text-white">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="relative">
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="mt-1 text-white/80 text-sm md:text-base">
              Here&apos;s your financial overview
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Wallet Balance */}
          <Card hover className="group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Wallet Balance
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    ₹{wallet?.current_balance ? Number(wallet.current_balance).toLocaleString() : '0'}
                  </p>
                </div>
                <div className="p-2.5 bg-primary-50 dark:bg-primary/10 rounded-xl text-primary dark:text-primary-light group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>
              <Link href="/wallet" className="block mt-4">
                <Button variant="primary" size="sm" fullWidth>
                  Manage Wallet
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Credit Score */}
          <Card hover className="group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Credit Score
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {creditScore?.score || 600}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="text-success">
                      {creditScore?.on_time_payments || 0} on-time
                    </span>
                    <span className="text-danger">
                      {creditScore?.late_payments || 0} late
                    </span>
                  </div>
                </div>
                <div className="p-2.5 bg-success-light dark:bg-success/10 rounded-xl text-success group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <Link href="/profile" className="block mt-4">
                <Button variant="success" size="sm" fullWidth>
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Loan Applications */}
          <Card hover className="group">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Loan Applications
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {loanApplications.length}
                  </p>
                </div>
                <div className="p-2.5 bg-secondary/10 rounded-xl text-secondary dark:text-secondary-light group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <Link href="/loans" className="block mt-4">
                <Button variant="secondary" size="sm" fullWidth>
                  View All Loans
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Loan Applications */}
        {loanApplications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle size="sm">Recent Loan Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loanApplications.slice(0, 5).map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary dark:text-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ₹{Number(application.requested_amount).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(application.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(application.status)} size="sm">
                      {application.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle size="sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {user?.role === 'BORROWER' && (
                <Link href="/loans/apply">
                  <Button variant="primary" fullWidth size="md">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Apply Loan
                  </Button>
                </Link>
              )}
              <Link href="/wallet">
                <Button variant="success" fullWidth size="md">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Funds
                </Button>
              </Link>
              <Link href="/kyc">
                <Button variant="secondary" fullWidth size="md">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  KYC
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" fullWidth size="md">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

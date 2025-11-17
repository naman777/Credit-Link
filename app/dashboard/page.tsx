'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { apiClient } from '@/lib/api/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<any>(null);
  const [creditScore, setCreditScore] = useState<any>(null);
  const [loanApplications, setLoanApplications] = useState<any[]>([]);
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
      if (loansRes.success) setLoanApplications(loansRes.data || []);
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
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto shadow-lg"></div>
          <p className="mt-6 text-gray-700 dark:text-gray-300 font-semibold text-lg">Loading your dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fadeIn">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Welcome back, {user?.name}! 👋</h1>
            <p className="text-lg md:text-xl text-white/90">Here's your financial overview for today.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wallet Balance */}
          <Card hover gradient className="group">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Wallet Balance</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                ₹{wallet?.current_balance ? Number(wallet.current_balance).toLocaleString() : '0'}
              </div>
              <Link href="/wallet">
                <Button variant="primary" size="sm" className="w-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Manage Wallet
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Credit Score */}
          <Card hover gradient className="group">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Credit Score</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                {creditScore?.score || 600}
              </div>
              <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {creditScore?.on_time_payments || 0} on-time
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {creditScore?.late_payments || 0} late
                </div>
              </div>
              <Link href="/profile">
                <Button variant="success" size="sm" className="w-full">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Active Loans */}
          <Card hover gradient className="group">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <CardTitle className="text-lg">Loan Applications</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                {loanApplications.length}
              </div>
              <Link href="/loans">
                <Button variant="secondary" size="sm" className="w-full">
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
              <CardTitle gradient>Recent Loan Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loanApplications.slice(0, 5).map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-5 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-850"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-lg text-gray-900 dark:text-white">
                          ₹{Number(application.requested_amount).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Applied on {new Date(application.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                        {application.purpose && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 italic">{application.purpose}</p>
                        )}
                      </div>
                    </div>
                    <Badge variant={getStatusBadgeVariant(application.status)} size="md" dot>
                      {application.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card gradient>
          <CardHeader>
            <CardTitle gradient>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {user?.role === 'BORROWER' && (
                <Link href="/loans/apply">
                  <Button variant="primary" fullWidth size="lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Apply for Loan
                  </Button>
                </Link>
              )}
              <Link href="/wallet">
                <Button variant="success" fullWidth size="lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Funds
                </Button>
              </Link>
              <Link href="/kyc">
                <Button variant="secondary" fullWidth size="lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Complete KYC
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" fullWidth size="lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

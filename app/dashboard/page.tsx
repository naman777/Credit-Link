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
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your account today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wallet Balance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                ₹{wallet?.current_balance ? Number(wallet.current_balance).toLocaleString() : '0'}
              </div>
              <Link href="/wallet">
                <Button variant="secondary" size="sm" className="mt-4">
                  Manage Wallet
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Credit Score */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Credit Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {creditScore?.score || 600}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <div>On-time payments: {creditScore?.on_time_payments || 0}</div>
                <div>Late payments: {creditScore?.late_payments || 0}</div>
              </div>
            </CardContent>
          </Card>

          {/* Active Loans */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loan Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {loanApplications.length}
              </div>
              <Link href="/loans">
                <Button variant="secondary" size="sm" className="mt-4">
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
              <CardTitle>Recent Loan Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loanApplications.slice(0, 5).map((application) => (
                  <div
                    key={application.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        ₹{Number(application.requested_amount).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(application.created_at).toLocaleDateString()}
                      </p>
                      {application.purpose && (
                        <p className="text-sm text-gray-500 mt-1">{application.purpose}</p>
                      )}
                    </div>
                    <Badge variant={getStatusBadgeVariant(application.status)}>
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
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {user?.role === 'BORROWER' && (
                <Link href="/loans/apply">
                  <Button fullWidth>Apply for Loan</Button>
                </Link>
              )}
              <Link href="/wallet">
                <Button variant="secondary" fullWidth>
                  Add Funds
                </Button>
              </Link>
              <Link href="/kyc">
                <Button variant="secondary" fullWidth>
                  Complete KYC
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="secondary" fullWidth>
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

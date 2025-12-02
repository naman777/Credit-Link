'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface LenderStats {
  totalInvested: number;
  activeLoans: number;
  totalEarned: number;
  pendingApplications: number;
  myLoans: any[];
  investmentOpportunities: any[];
}

export default function LenderDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<LenderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== 'LENDER' && user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    loadStats();
  }, [user, router]);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/lender/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to load lender stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFund = async (applicationId: string) => {
    setActionLoading(applicationId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/loans/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ applicationId })
      });
      const data = await res.json();
      if (data.success) {
        loadStats();
      } else {
        alert(data.message || 'Failed to fund loan');
      }
    } catch (error) {
      console.error('Failed to fund loan:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-3 border-primary-100 border-t-primary rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fadeIn">
        <div className="relative overflow-hidden bg-gradient-to-r from-primary via-secondary to-tertiary rounded-2xl p-6 md:p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="relative">
            <h1 className="text-2xl md:text-3xl font-bold">Lender Dashboard</h1>
            <p className="mt-1 text-white/80">Manage your investments and fund new loans</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{Number(stats?.totalInvested || 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.activeLoans || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Earned</p>
              <p className="text-2xl font-bold text-success">
                ₹{Number(stats?.totalEarned || 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Opportunities</p>
              <p className="text-2xl font-bold text-primary">{stats?.pendingApplications || 0}</p>
            </CardContent>
          </Card>
        </div>

        {/* Investment Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle size="sm">Investment Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.investmentOpportunities?.length ? (
              <div className="space-y-4">
                {stats.investmentOpportunities.map((app: any) => (
                  <div key={app.id} className="border dark:border-gray-700 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{app.borrower.name}</h3>
                          {app.borrower.kyc_documents[0]?.verification_status === 'VERIFIED' && (
                            <Badge variant="success" size="sm">KYC Verified</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Amount</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              ₹{Number(app.requested_amount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Interest</p>
                            <p className="text-gray-900 dark:text-white">{app.product.interest_rate}% p.a.</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Tenure</p>
                            <p className="text-gray-900 dark:text-white">{app.product.tenure_months} months</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Credit Score</p>
                            <p className="text-gray-900 dark:text-white">{app.borrower.credit_score?.score || 600}</p>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleFund(app.id)}
                        disabled={actionLoading === app.id}
                      >
                        {actionLoading === app.id ? 'Processing...' : 'Fund Loan'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No pending applications to fund</p>
            )}
          </CardContent>
        </Card>

        {/* My Investments */}
        <Card>
          <CardHeader>
            <CardTitle size="sm">My Investments</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.myLoans?.length ? (
              <div className="space-y-3">
                {stats.myLoans.map((loan: any) => {
                  const paidCount = loan.repayment_schedule.filter((s: any) => s.status === 'PAID').length;
                  const totalEmis = loan.repayment_schedule.length;
                  return (
                    <div key={loan.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {loan.application.borrower.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ₹{Number(loan.principal_amount).toLocaleString()} - {loan.application.product.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          EMIs: {paidCount}/{totalEmis} paid
                        </p>
                      </div>
                      <Badge variant={loan.status === 'ACTIVE' ? 'success' : loan.status === 'CLOSED' ? 'default' : 'danger'} size="sm">
                        {loan.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No investments yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

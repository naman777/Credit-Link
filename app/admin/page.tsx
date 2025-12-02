'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface AdminStats {
  totalUsers: number;
  totalBorrowers: number;
  totalLenders: number;
  pendingKyc: number;
  pendingLoans: number;
  activeLoans: number;
  totalDisbursed: number;
  totalRepaid: number;
  overdueEmis: number;
  recentApplications: any[];
  recentKyc: any[];
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    loadStats();
  }, [user, router]);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    } finally {
      setLoading(false);
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
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 md:p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="relative">
            <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-1 text-gray-300">Platform overview and management</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/kyc">
            <Card hover className="cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">KYC Verification</p>
                <Badge variant="warning" size="sm" className="mt-2">
                  {stats?.pendingKyc || 0} Pending
                </Badge>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/loans">
            <Card hover className="cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">Loan Approvals</p>
                <Badge variant="info" size="sm" className="mt-2">
                  {stats?.pendingLoans || 0} Pending
                </Badge>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/users">
            <Card hover className="cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">User Management</p>
                <Badge variant="default" size="sm" className="mt-2">
                  {stats?.totalUsers || 0} Users
                </Badge>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/reports">
            <Card hover className="cursor-pointer">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 mx-auto bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">Reports</p>
                <Badge variant="success" size="sm" className="mt-2">
                  View All
                </Badge>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalUsers || 0}</p>
              <div className="flex gap-2 mt-2 text-xs">
                <span className="text-primary">{stats?.totalBorrowers || 0} Borrowers</span>
                <span className="text-secondary">{stats?.totalLenders || 0} Lenders</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.activeLoans || 0}</p>
              <p className="text-xs text-danger mt-2">{stats?.overdueEmis || 0} Overdue EMIs</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Disbursed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{Number(stats?.totalDisbursed || 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Repaid</p>
              <p className="text-2xl font-bold text-success">
                ₹{Number(stats?.totalRepaid || 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Loan Applications */}
          <Card>
            <CardHeader>
              <CardTitle size="sm">Recent Loan Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.recentApplications?.length ? (
                  stats.recentApplications.map((app: any) => (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{app.borrower.name}</p>
                        <p className="text-xs text-gray-500">₹{Number(app.requested_amount).toLocaleString()} - {app.product.name}</p>
                      </div>
                      <Badge variant={app.status === 'PENDING' ? 'warning' : app.status === 'APPROVED' ? 'success' : 'danger'} size="sm">
                        {app.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No recent applications</p>
                )}
              </div>
              <Link href="/admin/loans" className="block mt-4">
                <Button variant="outline" size="sm" fullWidth>View All Applications</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pending KYC */}
          <Card>
            <CardHeader>
              <CardTitle size="sm">Pending KYC Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.recentKyc?.length ? (
                  stats.recentKyc.map((kyc: any) => (
                    <div key={kyc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{kyc.user.name}</p>
                        <p className="text-xs text-gray-500">{kyc.doc_type} - {kyc.doc_number}</p>
                      </div>
                      <Badge variant="warning" size="sm">PENDING</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No pending KYC</p>
                )}
              </div>
              <Link href="/admin/kyc" className="block mt-4">
                <Button variant="outline" size="sm" fullWidth>View All KYC</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

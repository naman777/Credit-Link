'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ReportData {
  loansByStatus: { status: string; count: number }[];
  loansByProduct: { name: string; count: number; total: number }[];
  monthlyDisbursements: { month: string; amount: number }[];
  topBorrowers: { name: string; email: string; totalLoans: number; totalAmount: number }[];
  overdueAnalysis: { days: string; count: number; amount: number }[];
}

export default function AdminReportsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    loadReports();
  }, [user, router]);

  const loadReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/reports', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Platform performance insights</p>
          </div>
          <Button variant="outline" onClick={() => router.push('/admin')}>
            Back to Dashboard
          </Button>
        </div>

        {/* Loans by Status */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle size="sm">Loans by Status</CardTitle>
            </CardHeader>
            <CardContent>
              {data?.loansByStatus?.length ? (
                <div className="space-y-3">
                  {data.loansByStatus.map((item) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{item.status}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{item.count}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">No data available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle size="sm">Loans by Product</CardTitle>
            </CardHeader>
            <CardContent>
              {data?.loansByProduct?.length ? (
                <div className="space-y-3">
                  {data.loansByProduct.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-900 dark:text-white">{item.name}</span>
                        <span className="text-xs text-gray-500 ml-2">({item.count} loans)</span>
                      </div>
                      <span className="font-semibold text-primary">₹{Number(item.total).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">No data available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Borrowers */}
        <Card>
          <CardHeader>
            <CardTitle size="sm">Top Borrowers</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.topBorrowers?.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left p-3 font-medium text-gray-500">Name</th>
                      <th className="text-left p-3 font-medium text-gray-500">Email</th>
                      <th className="text-left p-3 font-medium text-gray-500">Total Loans</th>
                      <th className="text-left p-3 font-medium text-gray-500">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topBorrowers.map((borrower, idx) => (
                      <tr key={idx} className="border-b dark:border-gray-700">
                        <td className="p-3 font-medium text-gray-900 dark:text-white">{borrower.name}</td>
                        <td className="p-3 text-gray-600 dark:text-gray-400">{borrower.email}</td>
                        <td className="p-3">{borrower.totalLoans}</td>
                        <td className="p-3 font-semibold text-primary">₹{Number(borrower.totalAmount).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No data available</p>
            )}
          </CardContent>
        </Card>

        {/* Monthly Disbursements */}
        <Card>
          <CardHeader>
            <CardTitle size="sm">Monthly Disbursements (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.monthlyDisbursements?.length ? (
              <div className="space-y-3">
                {data.monthlyDisbursements.map((item) => (
                  <div key={item.month} className="flex items-center gap-4">
                    <span className="w-20 text-gray-600 dark:text-gray-400">{item.month}</span>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                        <div
                          className="h-full bg-primary rounded"
                          style={{
                            width: `${Math.min(100, (item.amount / Math.max(...data.monthlyDisbursements.map(d => d.amount))) * 100)}%`
                          }}
                        />
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white w-32 text-right">
                      ₹{Number(item.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

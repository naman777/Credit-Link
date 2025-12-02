'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/lib/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface LoanProduct {
  name: string;
}

interface LoanApplication {
  id: string;
  requested_amount: string | number;
  status: string;
  purpose?: string;
  created_at: string;
  reviewed_at?: string;
  rejection_reason?: string;
  product?: LoanProduct;
}

export default function LoansPage() {
  const { user } = useAuth();
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLoanApplications();
  }, []);

  const loadLoanApplications = async () => {
    try {
      const result = await apiClient.getLoanApplications();
      if (result.success) {
        const data = result.data as { applications?: LoanApplication[] } | LoanApplication[];
        const loansData = Array.isArray(data) ? data : (data?.applications || []);
        setLoanApplications(loansData);
      }
    } catch (error) {
      console.error('Failed to load loan applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
      case 'CANCELLED':
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
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading loans...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Loans</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View and manage your loan applications
            </p>
          </div>
          {user?.role === 'BORROWER' && (
            <Link href="/loans/apply">
              <Button>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Apply
              </Button>
            </Link>
          )}
        </div>

        {/* Browse Products */}
        {user?.role === 'BORROWER' && (
          <Card className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 border-indigo-100 dark:border-indigo-900/50">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Browse Loan Products</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    Find the best loan product for your needs
                  </p>
                </div>
                <Link href="/loans/products">
                  <Button variant="secondary" size="sm">
                    View Products
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loan Applications */}
        <Card>
          <CardHeader>
            <CardTitle size="sm">Loan Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {loanApplications.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">No loan applications yet</p>
                {user?.role === 'BORROWER' && (
                  <Link href="/loans/apply">
                    <Button className="mt-4" size="sm">Apply for Your First Loan</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {loanApplications.map((application) => (
                  <div
                    key={application.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            ₹{Number(application.requested_amount).toLocaleString()}
                          </h3>
                          <Badge variant={getStatusBadgeVariant(application.status)} size="sm">
                            {application.status}
                          </Badge>
                        </div>

                        {application.product && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {application.product.name}
                          </p>
                        )}

                        {application.purpose && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {application.purpose}
                          </p>
                        )}

                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                          {new Date(application.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>

                        {application.rejection_reason && (
                          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
                            <p className="text-sm text-red-700 dark:text-red-400">
                              <span className="font-medium">Reason:</span> {application.rejection_reason}
                            </p>
                          </div>
                        )}
                      </div>
                      <Link href={`/loans/${application.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

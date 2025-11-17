'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/lib/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function LoansPage() {
  const { user } = useAuth();
  const [loanApplications, setLoanApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLoanApplications();
  }, []);

  const loadLoanApplications = async () => {
    try {
      const result = await apiClient.getLoanApplications();
      if (result.success) {
        setLoanApplications(result.data || []);
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
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading loans...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Loans</h1>
            <p className="text-gray-600 mt-1">View and manage your loan applications</p>
          </div>
          {user?.role === 'BORROWER' && (
            <Link href="/loans/apply">
              <Button>Apply for Loan</Button>
            </Link>
          )}
        </div>

        {/* Browse Products */}
        {user?.role === 'BORROWER' && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Browse Loan Products</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Explore available loan products and find the best one for you
                  </p>
                </div>
                <Link href="/loans/products">
                  <Button variant="secondary">View Products</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loan Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Loan Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {loanApplications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No loan applications yet</p>
                {user?.role === 'BORROWER' && (
                  <Link href="/loans/apply">
                    <Button className="mt-4">Apply for Your First Loan</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {loanApplications.map((application) => (
                  <div
                    key={application.id}
                    className="p-5 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            ₹{Number(application.requested_amount).toLocaleString()}
                          </h3>
                          <Badge variant={getStatusBadgeVariant(application.status)}>
                            {application.status}
                          </Badge>
                        </div>

                        {application.product && (
                          <p className="text-sm text-gray-600 mb-1">
                            Product: {application.product.name}
                          </p>
                        )}

                        {application.purpose && (
                          <p className="text-sm text-gray-600 mb-2">
                            Purpose: {application.purpose}
                          </p>
                        )}

                        <p className="text-xs text-gray-500">
                          Applied on: {new Date(application.created_at).toLocaleString()}
                        </p>

                        {application.reviewed_at && (
                          <p className="text-xs text-gray-500">
                            Reviewed on: {new Date(application.reviewed_at).toLocaleString()}
                          </p>
                        )}

                        {application.rejection_reason && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                            <p className="text-sm text-red-700">
                              <span className="font-medium">Rejection Reason:</span>{' '}
                              {application.rejection_reason}
                            </p>
                          </div>
                        )}
                      </div>
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

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface LoanApplication {
  id: string;
  requested_amount: string;
  status: string;
  purpose: string;
  created_at: string;
  borrower: {
    id: string;
    name: string;
    email: string;
    phone: string;
    credit_score: { score: number } | null;
    kyc_documents: { verification_status: string }[];
  };
  product: {
    name: string;
    interest_rate: string;
    tenure_months: number;
  };
  contract: {
    id: string;
    status: string;
  } | null;
}

export default function AdminLoansPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== 'ADMIN' && user.role !== 'LENDER') {
      router.push('/dashboard');
      return;
    }
    loadApplications();
  }, [user, router, filter]);

  const loadApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/loans?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setApplications(data.data.applications);
      }
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId: string) => {
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
        loadApplications();
      } else {
        alert(data.message || 'Failed to approve loan');
      }
    } catch (error) {
      console.error('Failed to approve loan:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (applicationId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    setActionLoading(applicationId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/loans/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ applicationId, reason })
      });
      const data = await res.json();
      if (data.success) {
        loadApplications();
      }
    } catch (error) {
      console.error('Failed to reject loan:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'PENDING': return 'warning';
      case 'REJECTED': return 'danger';
      default: return 'default';
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Loan Applications</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Review and approve loan requests</p>
          </div>
          <Button variant="outline" onClick={() => router.push('/admin')}>
            Back to Dashboard
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle size="sm">Applications ({applications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No applications found</p>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="border dark:border-gray-700 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{app.borrower.name}</h3>
                          <Badge variant={getStatusVariant(app.status)} size="sm">
                            {app.status}
                          </Badge>
                          {app.borrower.kyc_documents[0]?.verification_status === 'VERIFIED' && (
                            <Badge variant="success" size="sm">KYC Verified</Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Amount</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              ₹{Number(app.requested_amount).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Product</p>
                            <p className="text-gray-900 dark:text-white">{app.product.name}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Interest Rate</p>
                            <p className="text-gray-900 dark:text-white">{app.product.interest_rate}% p.a.</p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Tenure</p>
                            <p className="text-gray-900 dark:text-white">{app.product.tenure_months} months</p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Credit Score</p>
                            <p className="text-gray-900 dark:text-white">{app.borrower.credit_score?.score || 600}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Email</p>
                            <p className="text-gray-900 dark:text-white text-xs">{app.borrower.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Phone</p>
                            <p className="text-gray-900 dark:text-white">{app.borrower.phone}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Purpose</p>
                            <p className="text-gray-900 dark:text-white">{app.purpose || 'N/A'}</p>
                          </div>
                        </div>

                        <p className="text-xs text-gray-500">
                          Applied: {new Date(app.created_at).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>

                      {app.status === 'PENDING' && (
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleApprove(app.id)}
                            disabled={actionLoading === app.id}
                          >
                            {actionLoading === app.id ? 'Processing...' : 'Approve'}
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleReject(app.id)}
                            disabled={actionLoading === app.id}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
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

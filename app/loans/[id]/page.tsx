'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface LoanDetails {
  id: string;
  requested_amount: string;
  status: string;
  purpose: string;
  rejection_reason?: string;
  created_at: string;
  borrower: {
    name: string;
    email: string;
    phone: string;
    credit_score: { score: number } | null;
  };
  product: {
    name: string;
    interest_rate: string;
    tenure_months: number;
    processing_fee: string;
  };
  contract: {
    id: string;
    principal_amount: string;
    interest_rate: string;
    tenure_months: number;
    start_date: string;
    end_date: string;
    status: string;
    lender: { name: string; email: string };
    repayment_schedule: {
      id: string;
      installment_number: number;
      due_date: string;
      amount_due: string;
      principal_component: string;
      interest_component: string;
      status: string;
      late_fee: string | null;
      repayment_transaction: {
        paid_amount: string;
        late_fee: string;
        paid_at: string;
      } | null;
    }[];
  } | null;
}

export default function LoanDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loan, setLoan] = useState<LoanDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);

  useEffect(() => {
    loadLoanDetails();
  }, [params.id]);

  const loadLoanDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/loans/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLoan(data.data);
      }
    } catch (error) {
      console.error('Failed to load loan details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayEMI = async (scheduleId: string) => {
    setPaymentLoading(scheduleId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/repayments/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ scheduleId })
      });
      const data = await res.json();
      if (data.success) {
        loadLoanDetails();
      } else {
        alert(data.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setPaymentLoading(null);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'APPROVED':
      case 'ACTIVE':
      case 'PAID':
      case 'CLOSED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
      case 'OVERDUE':
      case 'DEFAULTED':
        return 'danger';
      default:
        return 'default';
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

  if (!loan) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <p className="text-gray-500">Loan not found</p>
          <Button variant="primary" className="mt-4" onClick={() => router.push('/loans')}>
            Back to Loans
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const totalPaid = loan.contract?.repayment_schedule
    .filter(s => s.status === 'PAID')
    .reduce((sum, s) => sum + Number(s.repayment_transaction?.paid_amount || 0), 0) || 0;

  const totalDue = loan.contract?.repayment_schedule
    .reduce((sum, s) => sum + Number(s.amount_due), 0) || 0;

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Loan Details</h1>
            <p className="text-sm text-gray-500">Application #{loan.id.slice(0, 8)}</p>
          </div>
          <Button variant="outline" onClick={() => router.push('/loans')}>
            Back to Loans
          </Button>
        </div>

        {/* Loan Overview */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle size="sm">Application Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <Badge variant={getStatusVariant(loan.status)}>{loan.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Requested Amount</span>
                  <span className="font-semibold">₹{Number(loan.requested_amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Product</span>
                  <span>{loan.product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Interest Rate</span>
                  <span>{loan.product.interest_rate}% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tenure</span>
                  <span>{loan.product.tenure_months} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Purpose</span>
                  <span>{loan.purpose || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Applied On</span>
                  <span>{new Date(loan.created_at).toLocaleDateString()}</span>
                </div>
                {loan.rejection_reason && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      <strong>Rejection Reason:</strong> {loan.rejection_reason}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {loan.contract && (
            <Card>
              <CardHeader>
                <CardTitle size="sm">Contract Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Contract Status</span>
                    <Badge variant={getStatusVariant(loan.contract.status)}>{loan.contract.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Principal</span>
                    <span className="font-semibold">₹{Number(loan.contract.principal_amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Start Date</span>
                    <span>{new Date(loan.contract.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">End Date</span>
                    <span>{new Date(loan.contract.end_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Funded By</span>
                    <span>{loan.contract.lender.name}</span>
                  </div>
                  <div className="pt-4 border-t dark:border-gray-700">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-500">Total Paid</span>
                      <span className="text-success font-semibold">₹{totalPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Due</span>
                      <span className="font-semibold">₹{totalDue.toLocaleString()}</span>
                    </div>
                    <div className="mt-2">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-success rounded-full"
                          style={{ width: `${(totalPaid / totalDue) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        {Math.round((totalPaid / totalDue) * 100)}% Complete
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Repayment Schedule */}
        {loan.contract && (
          <Card>
            <CardHeader>
              <CardTitle size="sm">Repayment Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left p-3 font-medium text-gray-500">EMI #</th>
                      <th className="text-left p-3 font-medium text-gray-500">Due Date</th>
                      <th className="text-left p-3 font-medium text-gray-500">Amount</th>
                      <th className="text-left p-3 font-medium text-gray-500">Principal</th>
                      <th className="text-left p-3 font-medium text-gray-500">Interest</th>
                      <th className="text-left p-3 font-medium text-gray-500">Status</th>
                      <th className="text-left p-3 font-medium text-gray-500">Paid On</th>
                      <th className="text-left p-3 font-medium text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loan.contract.repayment_schedule.map((emi) => (
                      <tr key={emi.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="p-3">{emi.installment_number}</td>
                        <td className="p-3">{new Date(emi.due_date).toLocaleDateString()}</td>
                        <td className="p-3 font-semibold">₹{Number(emi.amount_due).toLocaleString()}</td>
                        <td className="p-3">₹{Number(emi.principal_component).toLocaleString()}</td>
                        <td className="p-3">₹{Number(emi.interest_component).toLocaleString()}</td>
                        <td className="p-3">
                          <Badge variant={getStatusVariant(emi.status)} size="sm">{emi.status}</Badge>
                        </td>
                        <td className="p-3">
                          {emi.repayment_transaction
                            ? new Date(emi.repayment_transaction.paid_at).toLocaleDateString()
                            : '-'}
                        </td>
                        <td className="p-3">
                          {emi.status === 'PENDING' || emi.status === 'OVERDUE' ? (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handlePayEMI(emi.id)}
                              disabled={paymentLoading === emi.id}
                            >
                              {paymentLoading === emi.id ? 'Paying...' : 'Pay'}
                            </Button>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

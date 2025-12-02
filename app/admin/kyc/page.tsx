'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface KYCDocument {
  id: string;
  doc_type: string;
  doc_number: string;
  verification_status: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export default function AdminKYCPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [documents, setDocuments] = useState<KYCDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('PENDING');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    loadDocuments();
  }, [user, router, filter]);

  const loadDocuments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/kyc?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDocuments(data.data.documents);
      }
    } catch (error) {
      console.error('Failed to load KYC documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (documentId: string, status: 'VERIFIED' | 'REJECTED') => {
    setActionLoading(documentId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/kyc/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ kyc_id: documentId, status })
      });
      const data = await res.json();
      if (data.success) {
        loadDocuments();
      }
    } catch (error) {
      console.error('Failed to verify KYC:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'success';
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">KYC Verification</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Review and verify user identity documents</p>
          </div>
          <Button variant="outline" onClick={() => router.push('/admin')}>
            Back to Dashboard
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {['PENDING', 'VERIFIED', 'REJECTED', 'ALL'].map((status) => (
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

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle size="sm">KYC Documents ({documents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No documents found</p>
            ) : (
              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="border dark:border-gray-700 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{doc.user.name}</h3>
                          <Badge variant={getStatusVariant(doc.verification_status)} size="sm">
                            {doc.verification_status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Email</p>
                            <p className="text-gray-900 dark:text-white">{doc.user.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Phone</p>
                            <p className="text-gray-900 dark:text-white">{doc.user.phone}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Document Type</p>
                            <p className="text-gray-900 dark:text-white">{doc.doc_type}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Document Number</p>
                            <p className="text-gray-900 dark:text-white font-mono">{doc.doc_number}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          Submitted: {new Date(doc.created_at).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {doc.verification_status === 'PENDING' && (
                        <div className="flex gap-2">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleVerify(doc.id, 'VERIFIED')}
                            disabled={actionLoading === doc.id}
                          >
                            {actionLoading === doc.id ? 'Processing...' : 'Approve'}
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleVerify(doc.id, 'REJECTED')}
                            disabled={actionLoading === doc.id}
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

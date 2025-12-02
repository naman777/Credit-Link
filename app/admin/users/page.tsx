'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  created_at: string;
  kyc_documents: { verification_status: string }[];
  wallet: { current_balance: string } | null;
  credit_score: { score: number } | null;
  _count: { loan_applications: number };
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    loadUsers();
  }, [user, router, roleFilter, pagination.page]);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '20'
      });
      if (roleFilter) params.append('role', roleFilter);
      if (search) params.append('search', search);

      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data.users);
        setPagination(prev => ({
          ...prev,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    loadUsers();
  };

  const handleStatusChange = async (userId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, status })
      });
      const data = await res.json();
      if (data.success) {
        loadUsers();
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'pink' | 'gradient';

  const getRoleVariant = (role: string): BadgeVariant => {
    switch (role) {
      case 'ADMIN': return 'danger';
      case 'LENDER': return 'purple';
      case 'BORROWER': return 'success';
      default: return 'default';
    }
  };

  const getStatusVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'SUSPENDED': return 'danger';
      case 'INACTIVE': return 'warning';
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage platform users</p>
          </div>
          <Button variant="outline" onClick={() => router.push('/admin')}>
            Back to Dashboard
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button variant="primary" onClick={handleSearch}>Search</Button>
              </div>
              <div className="flex gap-2">
                {['', 'BORROWER', 'LENDER', 'ADMIN'].map((role) => (
                  <Button
                    key={role || 'ALL'}
                    variant={roleFilter === role ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setRoleFilter(role);
                      setPagination(prev => ({ ...prev, page: 1 }));
                    }}
                  >
                    {role || 'ALL'}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle size="sm">Users ({pagination.total})</CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No users found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left p-3 font-medium text-gray-500">User</th>
                      <th className="text-left p-3 font-medium text-gray-500">Contact</th>
                      <th className="text-left p-3 font-medium text-gray-500">Role</th>
                      <th className="text-left p-3 font-medium text-gray-500">Status</th>
                      <th className="text-left p-3 font-medium text-gray-500">KYC</th>
                      <th className="text-left p-3 font-medium text-gray-500">Balance</th>
                      <th className="text-left p-3 font-medium text-gray-500">Score</th>
                      <th className="text-left p-3 font-medium text-gray-500">Loans</th>
                      <th className="text-left p-3 font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="p-3">
                          <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
                          <p className="text-xs text-gray-500">{new Date(u.created_at).toLocaleDateString()}</p>
                        </td>
                        <td className="p-3">
                          <p className="text-gray-900 dark:text-white text-xs">{u.email}</p>
                          <p className="text-gray-500">{u.phone}</p>
                        </td>
                        <td className="p-3">
                          <Badge variant={getRoleVariant(u.role)} size="sm">{u.role}</Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant={getStatusVariant(u.status)} size="sm">{u.status}</Badge>
                        </td>
                        <td className="p-3">
                          {u.kyc_documents[0] ? (
                            <Badge
                              variant={u.kyc_documents[0].verification_status === 'VERIFIED' ? 'success' :
                                       u.kyc_documents[0].verification_status === 'PENDING' ? 'warning' : 'danger'}
                              size="sm"
                            >
                              {u.kyc_documents[0].verification_status}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="p-3 text-gray-900 dark:text-white">
                          ₹{u.wallet ? Number(u.wallet.current_balance).toLocaleString() : '0'}
                        </td>
                        <td className="p-3 text-gray-900 dark:text-white">
                          {u.credit_score?.score || 600}
                        </td>
                        <td className="p-3 text-gray-900 dark:text-white">
                          {u._count.loan_applications}
                        </td>
                        <td className="p-3">
                          {u.status === 'ACTIVE' ? (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleStatusChange(u.id, 'SUSPENDED')}
                            >
                              Suspend
                            </Button>
                          ) : (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleStatusChange(u.id, 'ACTIVE')}
                            >
                              Activate
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm text-gray-500">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

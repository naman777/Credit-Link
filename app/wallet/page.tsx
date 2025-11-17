'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';

export default function WalletPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const [walletRes, txRes] = await Promise.all([
        apiClient.getWalletBalance(),
        apiClient.getWalletTransactions(),
      ]);

      if (walletRes.success) setWallet(walletRes.data);
      if (txRes.success) setTransactions(txRes.data || []);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    setError('');
    const depositAmount = parseFloat(amount);

    if (!depositAmount || depositAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setProcessing(true);
    try {
      const result = await apiClient.deposit(depositAmount);
      if (result.success) {
        setShowDepositModal(false);
        setAmount('');
        loadWalletData();
      } else {
        setError(result.error || 'Deposit failed');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    setError('');
    const withdrawAmount = parseFloat(amount);

    if (!withdrawAmount || withdrawAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (wallet && withdrawAmount > Number(wallet.current_balance)) {
      setError('Insufficient balance');
      return;
    }

    setProcessing(true);
    try {
      const result = await apiClient.withdraw(withdrawAmount);
      if (result.success) {
        setShowWithdrawModal(false);
        setAmount('');
        loadWalletData();
      } else {
        setError(result.error || 'Withdrawal failed');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading wallet...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
          <p className="text-gray-600 mt-1">Manage your funds and view transaction history</p>
        </div>

        {/* Wallet Balance */}
        <Card>
          <CardHeader>
            <CardTitle>Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-blue-600">
                  ₹{wallet?.current_balance ? Number(wallet.current_balance).toLocaleString() : '0'}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Last updated: {wallet ? new Date(wallet.updated_at).toLocaleString() : '-'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setShowDepositModal(true)}>
                  Deposit
                </Button>
                <Button variant="secondary" onClick={() => setShowWithdrawModal(true)}>
                  Withdraw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No transactions yet</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Badge variant={tx.tx_type === 'CREDIT' ? 'success' : 'danger'}>
                          {tx.tx_type}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {tx.reference_type ? tx.reference_type.replace(/_/g, ' ') : 'Transaction'}
                        </span>
                      </div>
                      {tx.description && (
                        <p className="text-sm text-gray-500 mt-1">{tx.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(tx.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className={`text-lg font-semibold ${
                      tx.tx_type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.tx_type === 'CREDIT' ? '+' : '-'}₹{Number(tx.amount).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Deposit Modal */}
      <Modal
        isOpen={showDepositModal}
        onClose={() => {
          setShowDepositModal(false);
          setAmount('');
          setError('');
        }}
        title="Deposit Funds"
      >
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <Input
            label="Amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
          />
          <div className="flex gap-3">
            <Button onClick={handleDeposit} fullWidth disabled={processing}>
              {processing ? 'Processing...' : 'Deposit'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowDepositModal(false);
                setAmount('');
                setError('');
              }}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => {
          setShowWithdrawModal(false);
          setAmount('');
          setError('');
        }}
        title="Withdraw Funds"
      >
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
            Available balance: ₹{wallet?.current_balance ? Number(wallet.current_balance).toLocaleString() : '0'}
          </div>
          <Input
            label="Amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
          />
          <div className="flex gap-3">
            <Button onClick={handleWithdraw} fullWidth disabled={processing}>
              {processing ? 'Processing...' : 'Withdraw'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowWithdrawModal(false);
                setAmount('');
                setError('');
              }}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';

interface WalletData {
  current_balance: string | number;
  updated_at: string;
}

interface Transaction {
  id: string;
  tx_type: string;
  amount: string | number;
  reference_type?: string;
  description?: string;
  timestamp: string;
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
      if (txRes.success) {
        const txData = txRes.data;
        setTransactions(Array.isArray(txData) ? txData : []);
      }
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
    } catch {
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
    } catch {
      setError('An error occurred');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-primary-100 border-t-primary rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading wallet...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Wallet</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your funds and view transactions
          </p>
        </div>

        {/* Wallet Balance */}
        <Card className="bg-gradient-to-r from-primary via-secondary to-tertiary border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Current Balance</p>
                <div className="text-3xl font-bold text-white mt-1">
                  ₹{wallet?.current_balance ? Number(wallet.current_balance).toLocaleString() : '0'}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => setShowDepositModal(true)}
                  className="text-white border-white/20 hover:bg-white/20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Deposit
                </Button>
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => setShowWithdrawModal(true)}
                  className="text-white border-white/20 hover:bg-white/20"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                  Withdraw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle size="sm">Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        tx.tx_type === 'CREDIT'
                          ? 'bg-emerald-100 dark:bg-emerald-900/30'
                          : 'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        <svg
                          className={`w-5 h-5 ${
                            tx.tx_type === 'CREDIT'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {tx.tx_type === 'CREDIT' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          )}
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={tx.tx_type === 'CREDIT' ? 'success' : 'danger'} size="sm">
                            {tx.tx_type}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {tx.reference_type?.replace(/_/g, ' ') || 'Transaction'}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(tx.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${
                      tx.tx_type === 'CREDIT'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
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
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
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
            <Button onClick={handleDeposit} fullWidth disabled={processing} loading={processing}>
              {processing ? 'Processing...' : 'Deposit'}
            </Button>
            <Button
              variant="outline"
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
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-400 px-4 py-3 rounded-xl text-sm">
            Available: ₹{wallet?.current_balance ? Number(wallet.current_balance).toLocaleString() : '0'}
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
            <Button onClick={handleWithdraw} fullWidth disabled={processing} loading={processing}>
              {processing ? 'Processing...' : 'Withdraw'}
            </Button>
            <Button
              variant="outline"
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

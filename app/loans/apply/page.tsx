'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';

export default function ApplyLoanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedProductId = searchParams.get('product_id');

  const [products, setProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    product_id: preselectedProductId || '',
    requested_amount: '',
    purpose: '',
  });
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (formData.product_id && products.length > 0) {
      const product = products.find((p) => p.id === formData.product_id);
      setSelectedProduct(product || null);
    }
  }, [formData.product_id, products]);

  const loadProducts = async () => {
    try {
      const result = await apiClient.getLoanProducts();
      if (result.success) {
        setProducts(result.data || []);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amount = parseFloat(formData.requested_amount);

    if (!formData.product_id) {
      setError('Please select a loan product');
      return;
    }

    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (selectedProduct) {
      if (amount < Number(selectedProduct.min_amount)) {
        setError(`Minimum amount for this product is ₹${Number(selectedProduct.min_amount).toLocaleString()}`);
        return;
      }
      if (amount > Number(selectedProduct.max_amount)) {
        setError(`Maximum amount for this product is ₹${Number(selectedProduct.max_amount).toLocaleString()}`);
        return;
      }
    }

    setLoading(true);

    try {
      const result = await apiClient.applyForLoan({
        product_id: formData.product_id,
        requested_amount: amount,
        purpose: formData.purpose || undefined,
      });

      if (result.success) {
        router.push('/loans');
      } else {
        setError(result.error || 'Failed to submit loan application');
      }
    } catch (err) {
      setError('An error occurred while submitting the application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Apply for Loan</h1>
          <p className="text-gray-600 mt-1">Fill in the details below to apply for a loan</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Loan Application Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <Select
                label="Loan Product"
                value={formData.product_id}
                onChange={(e) =>
                  setFormData({ ...formData, product_id: e.target.value })
                }
                options={[
                  { value: '', label: 'Select a product' },
                  ...products.map((p) => ({ value: p.id, label: p.name })),
                ]}
                required
                fullWidth
              />

              {selectedProduct && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold text-blue-900">Product Details</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-blue-700">Amount Range:</span>
                      <p className="font-medium text-blue-900">
                        ₹{Number(selectedProduct.min_amount).toLocaleString()} - ₹
                        {Number(selectedProduct.max_amount).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-blue-700">Interest Rate:</span>
                      <p className="font-medium text-blue-900">
                        {Number(selectedProduct.interest_rate)}% per annum
                      </p>
                    </div>
                    <div>
                      <span className="text-blue-700">Tenure:</span>
                      <p className="font-medium text-blue-900">
                        {selectedProduct.tenure_months} months
                      </p>
                    </div>
                    <div>
                      <span className="text-blue-700">Processing Fee:</span>
                      <p className="font-medium text-blue-900">
                        ₹{Number(selectedProduct.processing_fee).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Input
                label="Requested Amount"
                type="number"
                placeholder="Enter amount"
                value={formData.requested_amount}
                onChange={(e) =>
                  setFormData({ ...formData, requested_amount: e.target.value })
                }
                required
                fullWidth
              />

              <Textarea
                label="Purpose (Optional)"
                placeholder="Describe the purpose of the loan"
                value={formData.purpose}
                onChange={(e) =>
                  setFormData({ ...formData, purpose: e.target.value })
                }
                rows={4}
                fullWidth
              />

              <div className="flex gap-3">
                <Button type="submit" fullWidth disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/loans')}
                  fullWidth
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

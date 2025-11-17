'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function LoanProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const result = await apiClient.getLoanProducts();
      if (result.success) {
        setProducts(result.data || []);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loan Products</h1>
          <p className="text-gray-600 mt-1">Choose the loan product that best fits your needs</p>
        </div>

        {products.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No loan products available at the moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Loan Amount</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ₹{Number(product.min_amount).toLocaleString()} - ₹
                        {Number(product.max_amount).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Interest Rate</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {Number(product.interest_rate)}% per annum
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Tenure</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {product.tenure_months} months
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Processing Fee</p>
                      <p className="text-lg font-semibold text-gray-900">
                        ₹{Number(product.processing_fee).toLocaleString()}
                      </p>
                    </div>

                    <Link href={`/loans/apply?product_id=${product.id}`}>
                      <Button fullWidth className="mt-4">
                        Apply Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

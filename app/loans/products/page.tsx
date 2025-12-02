'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface LoanProduct {
  id: string;
  name: string;
  min_amount: string | number;
  max_amount: string | number;
  interest_rate: string | number;
  tenure_months: number;
  processing_fee: string | number;
}

export default function LoanProductsPage() {
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const result = await apiClient.getLoanProducts();
      if (result.success) {
        const data = result.data as { products?: LoanProduct[] } | LoanProduct[];
        const productsData = Array.isArray(data) ? data : (data?.products || []);
        setProducts(productsData);
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
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-primary-100 border-t-primary rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading products...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Loan Products</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Choose the loan product that best fits your needs</p>
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
                      <p className="text-sm text-gray-500 dark:text-gray-400">Loan Amount</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        ₹{Number(product.min_amount).toLocaleString()} - ₹
                        {Number(product.max_amount).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Interest Rate</p>
                      <p className="text-lg font-semibold text-primary">
                        {Number(product.interest_rate)}% per annum
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tenure</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {product.tenure_months} months
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Processing Fee</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
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

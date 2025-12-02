import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/utils/middleware';
import { apiResponse, apiError } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticate(request);
    if (!('user' in authResult)) return authResult;

    const { user } = authResult;
    if (!requireRole(user, ['ADMIN'])) {
      return apiError('Unauthorized', 403);
    }

    // Loans by status
    const loansByStatus = await prisma.loanApplication.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    // Loans by product
    const loansByProduct = await prisma.loanApplication.groupBy({
      by: ['product_id'],
      _count: { id: true },
      _sum: { requested_amount: true }
    });

    const products = await prisma.loanProduct.findMany({
      select: { id: true, name: true }
    });

    const productMap = new Map(products.map((p: { id: string; name: string }) => [p.id, p.name]));

    // Top borrowers
    const topBorrowers = await prisma.loanApplication.groupBy({
      by: ['borrower_id'],
      _count: { id: true },
      _sum: { requested_amount: true },
      where: { status: 'APPROVED' },
      orderBy: { _sum: { requested_amount: 'desc' } },
      take: 10
    });

    const borrowerIds = topBorrowers.map((b: { borrower_id: string }) => b.borrower_id);
    const borrowers = await prisma.user.findMany({
      where: { id: { in: borrowerIds } },
      select: { id: true, name: true, email: true }
    });
    const borrowerMap = new Map<string, { id: string; name: string; email: string }>(borrowers.map((b: { id: string; name: string; email: string }) => [b.id, b]));

    // Monthly disbursements (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const contracts = await prisma.loanContract.findMany({
      where: {
        created_at: { gte: sixMonthsAgo }
      },
      select: {
        principal_amount: true,
        created_at: true
      }
    });

    const monthlyData: { [key: string]: number } = {};
    contracts.forEach((c: { principal_amount: unknown; created_at: Date }) => {
      const month = c.created_at.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyData[month] = (monthlyData[month] || 0) + Number(c.principal_amount);
    });

    return apiResponse({
      loansByStatus: loansByStatus.map((l: { status: string; _count: { id: number } }) => ({
        status: l.status,
        count: l._count.id
      })),
      loansByProduct: loansByProduct.map((l: { product_id: string; _count: { id: number }; _sum: { requested_amount: unknown } }) => ({
        name: productMap.get(l.product_id) || 'Unknown',
        count: l._count.id,
        total: l._sum.requested_amount || 0
      })),
      topBorrowers: topBorrowers.map((b: { borrower_id: string; _count: { id: number }; _sum: { requested_amount: unknown } }) => ({
        name: borrowerMap.get(b.borrower_id)?.name || 'Unknown',
        email: borrowerMap.get(b.borrower_id)?.email || '',
        totalLoans: b._count.id,
        totalAmount: b._sum.requested_amount || 0
      })),
      monthlyDisbursements: Object.entries(monthlyData).map(([month, amount]) => ({
        month,
        amount
      }))
    });
  } catch (error) {
    console.error('Admin reports error:', error);
    return apiError('Failed to fetch reports', 500);
  }
}

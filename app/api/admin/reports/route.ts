import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/utils/middleware';
import { apiResponse, apiError } from '@/lib/utils/api-response';

export async function GET(request: Request) {
  try {
    const authResult = await authenticate(request);
    if (authResult instanceof NextResponse) return authResult;

    const roleCheck = requireRole(authResult, ['ADMIN']);
    if (roleCheck) return roleCheck;

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

    const productMap = new Map(products.map(p => [p.id, p.name]));

    // Top borrowers
    const topBorrowers = await prisma.loanApplication.groupBy({
      by: ['borrower_id'],
      _count: { id: true },
      _sum: { requested_amount: true },
      where: { status: 'APPROVED' },
      orderBy: { _sum: { requested_amount: 'desc' } },
      take: 10
    });

    const borrowerIds = topBorrowers.map(b => b.borrower_id);
    const borrowers = await prisma.user.findMany({
      where: { id: { in: borrowerIds } },
      select: { id: true, name: true, email: true }
    });
    const borrowerMap = new Map(borrowers.map(b => [b.id, b]));

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
    contracts.forEach(c => {
      const month = c.created_at.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyData[month] = (monthlyData[month] || 0) + Number(c.principal_amount);
    });

    return apiResponse({
      loansByStatus: loansByStatus.map(l => ({
        status: l.status,
        count: l._count.id
      })),
      loansByProduct: loansByProduct.map(l => ({
        name: productMap.get(l.product_id) || 'Unknown',
        count: l._count.id,
        total: l._sum.requested_amount || 0
      })),
      topBorrowers: topBorrowers.map(b => ({
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

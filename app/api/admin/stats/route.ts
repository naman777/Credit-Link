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

    const [
      totalUsers,
      totalBorrowers,
      totalLenders,
      pendingKyc,
      pendingLoans,
      activeLoans,
      totalDisbursed,
      totalRepaid,
      overdueEmis
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'BORROWER' } }),
      prisma.user.count({ where: { role: 'LENDER' } }),
      prisma.kYCDocument.count({ where: { verification_status: 'PENDING' } }),
      prisma.loanApplication.count({ where: { status: 'PENDING' } }),
      prisma.loanContract.count({ where: { status: 'ACTIVE' } }),
      prisma.loanContract.aggregate({
        _sum: { principal_amount: true },
        where: { status: { in: ['ACTIVE', 'CLOSED'] } }
      }),
      prisma.repaymentTransaction.aggregate({
        _sum: { paid_amount: true }
      }),
      prisma.repaymentSchedule.count({
        where: { status: 'OVERDUE' }
      })
    ]);

    const recentApplications = await prisma.loanApplication.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        borrower: { select: { name: true, email: true } },
        product: { select: { name: true } }
      }
    });

    const recentKyc = await prisma.kYCDocument.findMany({
      take: 5,
      where: { verification_status: 'PENDING' },
      orderBy: { created_at: 'desc' },
      include: {
        user: { select: { name: true, email: true } }
      }
    });

    return apiResponse({
      totalUsers,
      totalBorrowers,
      totalLenders,
      pendingKyc,
      pendingLoans,
      activeLoans,
      totalDisbursed: totalDisbursed._sum.principal_amount || 0,
      totalRepaid: totalRepaid._sum.paid_amount || 0,
      overdueEmis,
      recentApplications,
      recentKyc
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return apiError('Failed to fetch admin stats', 500);
  }
}

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/utils/middleware';
import { apiResponse, apiError } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticate(request);
    if (!('user' in authResult)) return authResult;

    const { user } = authResult;
    if (!requireRole(user, ['LENDER', 'ADMIN'])) {
      return apiError('Unauthorized', 403);
    }

    const userId = user.userId;

    const [
      totalInvested,
      activeLoans,
      totalEarned,
      pendingApplications,
      myLoans
    ] = await Promise.all([
      prisma.loanContract.aggregate({
        _sum: { principal_amount: true },
        where: { lender_id: userId }
      }),
      prisma.loanContract.count({
        where: { lender_id: userId, status: 'ACTIVE' }
      }),
      prisma.repaymentTransaction.aggregate({
        _sum: { paid_amount: true },
        where: {
          schedule: {
            loan: { lender_id: userId }
          }
        }
      }),
      prisma.loanApplication.count({
        where: { status: 'PENDING' }
      }),
      prisma.loanContract.findMany({
        where: { lender_id: userId },
        orderBy: { created_at: 'desc' },
        take: 10,
        include: {
          application: {
            include: {
              borrower: {
                select: { name: true, email: true }
              },
              product: {
                select: { name: true }
              }
            }
          },
          repayment_schedule: {
            select: {
              status: true,
              amount_due: true
            }
          }
        }
      })
    ]);

    const investmentOpportunities = await prisma.loanApplication.findMany({
      where: { status: 'PENDING' },
      orderBy: { created_at: 'desc' },
      take: 10,
      include: {
        borrower: {
          select: {
            name: true,
            credit_score: { select: { score: true } },
            kyc_documents: {
              select: { verification_status: true },
              take: 1
            }
          }
        },
        product: {
          select: {
            name: true,
            interest_rate: true,
            tenure_months: true
          }
        }
      }
    });

    return apiResponse({
      totalInvested: totalInvested._sum.principal_amount || 0,
      activeLoans,
      totalEarned: totalEarned._sum.paid_amount || 0,
      pendingApplications,
      myLoans,
      investmentOpportunities
    });
  } catch (error) {
    console.error('Lender stats error:', error);
    return apiError('Failed to fetch lender stats', 500);
  }
}

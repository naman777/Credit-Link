import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate } from '@/lib/utils/middleware';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const { user } = authResult;

    // Get credit score
    const creditScore = await prisma.creditScore.findUnique({
      where: { user_id: user.userId },
    });

    if (!creditScore) {
      return errorResponse('Credit score not found', 404);
    }

    // Get loan history
    const loanHistory = await prisma.loanApplication.findMany({
      where: {
        borrower_id: user.userId,
        status: 'APPROVED',
      },
      include: {
        contract: {
          select: {
            status: true,
          },
        },
      },
    });

    const activeLoans = loanHistory.filter(
      (l: any) => l.contract?.status === 'ACTIVE'
    ).length;
    const closedLoans = loanHistory.filter(
      (l: any) => l.contract?.status === 'CLOSED'
    ).length;

    return successResponse({
      score: creditScore.score,
      total_loans_taken: creditScore.total_loans_taken,
      active_loans: activeLoans,
      closed_loans: closedLoans,
      defaults_count: creditScore.defaults_count,
      on_time_payments: creditScore.on_time_payments,
      late_payments: creditScore.late_payments,
      last_updated: creditScore.last_updated,
      rating: getCreditRating(creditScore.score),
    });
  } catch (error: any) {
    console.error('Get credit score error:', error);
    return errorResponse(error.message || 'Failed to get credit score');
  }
}

function getCreditRating(score: number): string {
  if (score >= 750) return 'Excellent';
  if (score >= 700) return 'Good';
  if (score >= 650) return 'Fair';
  if (score >= 600) return 'Average';
  return 'Poor';
}

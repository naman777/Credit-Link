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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const loanId = searchParams.get('loan_id');
    const status = searchParams.get('status');

    if (!loanId) {
      return errorResponse('loan_id is required', 400);
    }

    // Check if user is the borrower or lender of this loan
    const loan = await prisma.loanContract.findUnique({
      where: { id: loanId },
      include: {
        application: true,
      },
    });

    if (!loan) {
      return errorResponse('Loan not found', 404);
    }

    if (
      loan.application.borrower_id !== user.userId &&
      loan.lender_id !== user.userId
    ) {
      return errorResponse('Unauthorized', 403);
    }

    // Build where clause
    const where: any = { loan_id: loanId };
    if (status) {
      where.status = status;
    }

    // Get repayment schedule
    const schedule = await prisma.repaymentSchedule.findMany({
      where,
      include: {
        repayment_transaction: true,
      },
      orderBy: { installment_number: 'asc' },
    });

    return successResponse({
      loan_id: loanId,
      schedule: schedule.map((s: any) => ({
        id: s.id,
        installment_number: s.installment_number,
        due_date: s.due_date,
        amount_due: s.amount_due,
        principal_component: s.principal_component,
        interest_component: s.interest_component,
        status: s.status,
        paid_on: s.paid_on,
        late_fee: s.late_fee,
        repayment: s.repayment_transaction
          ? {
              paid_amount: s.repayment_transaction.paid_amount,
              late_fee: s.repayment_transaction.late_fee,
              paid_at: s.repayment_transaction.paid_at,
            }
          : null,
      })),
    });
  } catch (error: any) {
    console.error('Get schedule error:', error);
    return errorResponse(error.message || 'Failed to get repayment schedule');
  }
}

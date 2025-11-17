import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/utils/middleware';
import { rejectLoanSchema } from '@/lib/validators/loan';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  forbiddenResponse,
} from '@/lib/utils/api-response';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult instanceof Response) {
      return authResult;
    }

    const { user } = authResult;

    // Check if user is admin
    if (!requireRole(user, ['ADMIN'])) {
      return forbiddenResponse('Only admins can reject loan applications');
    }

    const body = await request.json();

    // Validate input
    const validationResult = rejectLoanSchema.safeParse(body);
    if (!validationResult.success) {
      return validationErrorResponse(
        validationResult.error.errors[0].message
      );
    }

    const { application_id, rejection_reason } = validationResult.data;

    // Get application
    const application = await prisma.loanApplication.findUnique({
      where: { id: application_id },
    });

    if (!application) {
      return errorResponse('Loan application not found', 404);
    }

    if (application.status !== 'PENDING') {
      return errorResponse('Loan application is not pending', 400);
    }

    // Update application status
    const updated = await prisma.$transaction(async (tx) => {
      const app = await tx.loanApplication.update({
        where: { id: application_id },
        data: {
          status: 'REJECTED',
          rejection_reason,
          reviewed_at: new Date(),
          reviewed_by: user.userId,
        },
      });

      // Create notification
      await tx.notificationLog.create({
        data: {
          user_id: application.borrower_id,
          message: `Your loan application has been rejected. Reason: ${rejection_reason}`,
          type: 'LOAN_REJECTED',
        },
      });

      return app;
    });

    return successResponse(
      {
        application_id,
        status: 'REJECTED',
        rejection_reason,
      },
      'Loan application rejected'
    );
  } catch (error: any) {
    console.error('Reject loan error:', error);
    return errorResponse(error.message || 'Failed to reject loan');
  }
}

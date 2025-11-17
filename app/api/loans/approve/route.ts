import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/utils/middleware';
import { approveLoanSchema } from '@/lib/validators/loan';
import { disburseLoan } from '@/lib/services/loan.service';
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
    const body = await request.json();

    // Validate input
    const validationResult = approveLoanSchema.safeParse(body);
    if (!validationResult.success) {
      return validationErrorResponse(
        validationResult.error.issues[0].message
      );
    }

    const { application_id, lender_id } = validationResult.data;

    // Check if user is admin or the lender
    if (
      !requireRole(user, ['ADMIN']) &&
      user.userId !== lender_id
    ) {
      return forbiddenResponse(
        'Only admins or the lender can approve loans'
      );
    }

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
    await prisma.loanApplication.update({
      where: { id: application_id },
      data: {
        status: 'APPROVED',
        reviewed_at: new Date(),
        reviewed_by: user.userId,
      },
    });

    // Disburse the loan
    const contract = await disburseLoan(application_id, lender_id);

    return successResponse(
      {
        application_id,
        contract_id: contract.id,
        status: 'APPROVED',
        disbursed: true,
      },
      'Loan approved and disbursed successfully'
    );
  } catch (error: any) {
    console.error('Approve loan error:', error);
    return errorResponse(error.message || 'Failed to approve loan');
  }
}

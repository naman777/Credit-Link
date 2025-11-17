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
    const status = searchParams.get('status');

    // Build where clause
    const where: any = { borrower_id: user.userId };
    if (status) {
      where.status = status;
    }

    // Get applications
    const applications = await prisma.loanApplication.findMany({
      where,
      include: {
        product: true,
        contract: {
          include: {
            lender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return successResponse({
      applications: applications.map((app) => ({
        id: app.id,
        product: {
          id: app.product.id,
          name: app.product.name,
          interest_rate: app.product.interest_rate,
          tenure_months: app.product.tenure_months,
        },
        requested_amount: app.requested_amount,
        status: app.status,
        purpose: app.purpose,
        rejection_reason: app.rejection_reason,
        created_at: app.created_at,
        reviewed_at: app.reviewed_at,
        contract: app.contract
          ? {
              id: app.contract.id,
              status: app.contract.status,
              lender: app.contract.lender,
              start_date: app.contract.start_date,
              end_date: app.contract.end_date,
            }
          : null,
      })),
    });
  } catch (error: any) {
    console.error('Get applications error:', error);
    return errorResponse(error.message || 'Failed to get loan applications');
  }
}

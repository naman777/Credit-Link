import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate } from '@/lib/utils/middleware';
import { apiResponse, apiError } from '@/lib/utils/api-response';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticate(request);
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await params;
    const userId = authResult.userId;

    const application = await prisma.loanApplication.findUnique({
      where: { id },
      include: {
        borrower: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            credit_score: true
          }
        },
        product: true,
        contract: {
          include: {
            lender: {
              select: { name: true, email: true }
            },
            repayment_schedule: {
              orderBy: { installment_number: 'asc' },
              include: {
                repayment_transaction: true
              }
            }
          }
        }
      }
    });

    if (!application) {
      return apiError('Loan application not found', 404);
    }

    // Check access - borrower, lender, or admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    const isOwner = application.borrower_id === userId;
    const isLender = application.contract?.lender_id === userId;
    const isAdmin = user?.role === 'ADMIN';

    if (!isOwner && !isLender && !isAdmin) {
      return apiError('Unauthorized', 403);
    }

    return apiResponse(application);
  } catch (error) {
    console.error('Get loan details error:', error);
    return apiError('Failed to fetch loan details', 500);
  }
}

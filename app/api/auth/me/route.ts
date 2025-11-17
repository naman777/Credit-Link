import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate } from '@/lib/utils/middleware';
import { successResponse, errorResponse } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticate(request);
    if (authResult instanceof Response) {
      return authResult; // Return error response
    }

    const { user: authUser } = authResult;

    // Fetch user details
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      include: {
        wallet: true,
        credit_score: true,
        kyc_documents: {
          where: { verification_status: 'VERIFIED' },
        },
      },
    });

    if (!user) {
      return errorResponse('User not found', 404);
    }

    return successResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      wallet: {
        id: user.wallet?.id,
        balance: user.wallet?.current_balance,
      },
      credit_score: {
        score: user.credit_score?.score,
        total_loans: user.credit_score?.total_loans_taken,
        defaults: user.credit_score?.defaults_count,
        on_time_payments: user.credit_score?.on_time_payments,
      },
      kyc_verified: user.kyc_documents.length > 0,
      created_at: user.created_at,
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return errorResponse(error.message || 'Failed to get user details');
  }
}

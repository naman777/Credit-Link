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

    // Get wallet details
    const wallet = await prisma.wallet.findUnique({
      where: { user_id: user.userId },
    });

    if (!wallet) {
      return errorResponse('Wallet not found', 404);
    }

    return successResponse({
      wallet_id: wallet.id,
      balance: wallet.current_balance,
      updated_at: wallet.updated_at,
    });
  } catch (error: any) {
    console.error('Get balance error:', error);
    return errorResponse(error.message || 'Failed to get wallet balance');
  }
}

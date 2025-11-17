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
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get transactions
    const transactions = await prisma.walletTransaction.findMany({
      where: { user_id: user.userId },
      orderBy: { timestamp: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await prisma.walletTransaction.count({
      where: { user_id: user.userId },
    });

    return successResponse({
      transactions: transactions.map((tx) => ({
        id: tx.id,
        type: tx.tx_type,
        amount: tx.amount,
        reference_type: tx.reference_type,
        description: tx.description,
        timestamp: tx.timestamp,
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error: any) {
    console.error('Get transactions error:', error);
    return errorResponse(error.message || 'Failed to get transactions');
  }
}

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate } from '@/lib/utils/middleware';
import { depositSchema } from '@/lib/validators/wallet';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
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
    const validationResult = depositSchema.safeParse(body);
    if (!validationResult.success) {
      return validationErrorResponse(
        validationResult.error.issues[0].message
      );
    }

    const { amount } = validationResult.data;

    // Perform deposit transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Get wallet
      const wallet = await tx.wallet.findUnique({
        where: { user_id: user.userId },
      });

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      // Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          current_balance: {
            increment: amount,
          },
        },
      });

      // Create transaction record
      const transaction = await tx.walletTransaction.create({
        data: {
          wallet_id: wallet.id,
          user_id: user.userId,
          tx_type: 'CREDIT',
          amount,
          reference_type: 'DEPOSIT',
          description: `Deposit of ₹${amount}`,
        },
      });

      // Create notification
      await tx.notificationLog.create({
        data: {
          user_id: user.userId,
          message: `₹${amount} has been credited to your wallet`,
          type: 'WALLET_CREDIT',
        },
      });

      return { updatedWallet, transaction };
    });

    return successResponse(
      {
        wallet_id: result.updatedWallet.id,
        new_balance: result.updatedWallet.current_balance,
        transaction: {
          id: result.transaction.id,
          amount: result.transaction.amount,
          type: result.transaction.tx_type,
          timestamp: result.transaction.timestamp,
        },
      },
      'Deposit successful'
    );
  } catch (error: any) {
    console.error('Deposit error:', error);
    return errorResponse(error.message || 'Failed to deposit funds');
  }
}

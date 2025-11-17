import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate } from '@/lib/utils/middleware';
import { withdrawSchema } from '@/lib/validators/wallet';
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
    const validationResult = withdrawSchema.safeParse(body);
    if (!validationResult.success) {
      return validationErrorResponse(
        validationResult.error.errors[0].message
      );
    }

    const { amount } = validationResult.data;

    // Perform withdrawal transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get wallet
      const wallet = await tx.wallet.findUnique({
        where: { user_id: user.userId },
      });

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      // Check if sufficient balance
      if (Number(wallet.current_balance) < amount) {
        throw new Error('Insufficient balance');
      }

      // Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          current_balance: {
            decrement: amount,
          },
        },
      });

      // Create transaction record
      const transaction = await tx.walletTransaction.create({
        data: {
          wallet_id: wallet.id,
          user_id: user.userId,
          tx_type: 'DEBIT',
          amount,
          reference_type: 'WITHDRAWAL',
          description: `Withdrawal of ₹${amount}`,
        },
      });

      // Create notification
      await tx.notificationLog.create({
        data: {
          user_id: user.userId,
          message: `₹${amount} has been debited from your wallet`,
          type: 'WALLET_DEBIT',
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
      'Withdrawal successful'
    );
  } catch (error: any) {
    console.error('Withdrawal error:', error);
    return errorResponse(
      error.message || 'Failed to withdraw funds',
      error.message === 'Insufficient balance' ? 400 : 500
    );
  }
}

import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/utils/middleware';
import { makeRepaymentSchema } from '@/lib/validators/wallet';
import { makeRepayment } from '@/lib/services/repayment.service';
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
    const validationResult = makeRepaymentSchema.safeParse(body);
    if (!validationResult.success) {
      return validationErrorResponse(
        validationResult.error.issues[0].message
      );
    }

    const { schedule_id, amount } = validationResult.data;

    // Make repayment
    const result = await makeRepayment(user.userId, schedule_id, amount);

    return successResponse(
      {
        schedule_id,
        paid_amount: amount,
        late_fee: result.lateFee,
        total_paid: amount + result.lateFee,
        status: result.updatedSchedule.status,
        paid_on: result.updatedSchedule.paid_on,
      },
      'Repayment successful'
    );
  } catch (error: any) {
    console.error('Make repayment error:', error);
    return errorResponse(
      error.message || 'Failed to make repayment',
      error.message === 'Insufficient balance' ? 400 : 500
    );
  }
}

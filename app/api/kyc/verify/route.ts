import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/utils/middleware';
import { kycVerifySchema } from '@/lib/validators/kyc';
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
      return forbiddenResponse('Only admins can verify KYC documents');
    }

    const body = await request.json();

    // Validate input
    const validationResult = kycVerifySchema.safeParse(body);
    if (!validationResult.success) {
      return validationErrorResponse(
        validationResult.error.issues[0].message
      );
    }

    const { kyc_id, status } = validationResult.data;

    // Update KYC document
    const kycDoc = await prisma.kYCDocument.update({
      where: { id: kyc_id },
      data: {
        verification_status: status,
        verified_at: new Date(),
      },
      include: {
        user: true,
      },
    });

    // Create notification
    await prisma.notificationLog.create({
      data: {
        user_id: kycDoc.user_id,
        message: `Your ${kycDoc.doc_type} document has been ${status.toLowerCase()}`,
        type: status === 'VERIFIED' ? 'KYC_VERIFIED' : 'KYC_REJECTED',
      },
    });

    return successResponse(
      {
        id: kycDoc.id,
        user_id: kycDoc.user_id,
        doc_type: kycDoc.doc_type,
        status: kycDoc.verification_status,
        verified_at: kycDoc.verified_at,
      },
      `KYC document ${status.toLowerCase()} successfully`
    );
  } catch (error: any) {
    console.error('KYC verify error:', error);
    return errorResponse(error.message || 'Failed to verify KYC document');
  }
}

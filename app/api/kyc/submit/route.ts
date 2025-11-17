import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate } from '@/lib/utils/middleware';
import { kycSubmitSchema } from '@/lib/validators/kyc';
import {
  createdResponse,
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
    const validationResult = kycSubmitSchema.safeParse(body);
    if (!validationResult.success) {
      return validationErrorResponse(
        validationResult.error.issues[0].message
      );
    }

    const { doc_type, doc_number } = validationResult.data;

    // Check if user already has a verified KYC of this type
    const existingKYC = await prisma.kYCDocument.findFirst({
      where: {
        user_id: user.userId,
        doc_type,
        verification_status: 'VERIFIED',
      },
    });

    if (existingKYC) {
      return errorResponse(
        'You already have a verified document of this type',
        409
      );
    }

    // Create KYC document
    const kycDoc = await prisma.kYCDocument.create({
      data: {
        user_id: user.userId,
        doc_type,
        doc_number,
        verification_status: 'PENDING',
      },
    });

    // Create notification
    await prisma.notificationLog.create({
      data: {
        user_id: user.userId,
        message: `Your ${doc_type} document has been submitted for verification`,
        type: 'KYC_VERIFIED',
      },
    });

    return createdResponse(
      {
        id: kycDoc.id,
        doc_type: kycDoc.doc_type,
        status: kycDoc.verification_status,
        created_at: kycDoc.created_at,
      },
      'KYC document submitted successfully'
    );
  } catch (error: any) {
    console.error('KYC submit error:', error);
    return errorResponse(error.message || 'Failed to submit KYC document');
  }
}

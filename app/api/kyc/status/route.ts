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

    // Get all KYC documents for user
    const kycDocuments = await prisma.kYCDocument.findMany({
      where: { user_id: user.userId },
      orderBy: { created_at: 'desc' },
    });

    return successResponse({
      documents: kycDocuments.map((doc) => ({
        id: doc.id,
        doc_type: doc.doc_type,
        doc_number: doc.doc_number,
        status: doc.verification_status,
        created_at: doc.created_at,
        verified_at: doc.verified_at,
      })),
      has_verified_kyc: kycDocuments.some(
        (doc) => doc.verification_status === 'VERIFIED'
      ),
    });
  } catch (error: any) {
    console.error('KYC status error:', error);
    return errorResponse(error.message || 'Failed to get KYC status');
  }
}

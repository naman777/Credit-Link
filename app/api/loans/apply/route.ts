import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate } from '@/lib/utils/middleware';
import { loanApplicationSchema } from '@/lib/validators/loan';
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
    const validationResult = loanApplicationSchema.safeParse(body);
    if (!validationResult.success) {
      return validationErrorResponse(
        validationResult.error.errors[0].message
      );
    }

    const { product_id, requested_amount, purpose } = validationResult.data;

    // Check if user has verified KYC
    const verifiedKYC = await prisma.kYCDocument.findFirst({
      where: {
        user_id: user.userId,
        verification_status: 'VERIFIED',
      },
    });

    if (!verifiedKYC) {
      return errorResponse('Please complete KYC verification first', 400);
    }

    // Get product details
    const product = await prisma.loanProduct.findUnique({
      where: { id: product_id },
    });

    if (!product || !product.is_active) {
      return errorResponse('Invalid loan product', 404);
    }

    // Validate amount range
    if (
      requested_amount < Number(product.min_amount) ||
      requested_amount > Number(product.max_amount)
    ) {
      return errorResponse(
        `Amount must be between ₹${product.min_amount} and ₹${product.max_amount}`,
        400
      );
    }

    // Check if user has any pending applications
    const pendingApplication = await prisma.loanApplication.findFirst({
      where: {
        borrower_id: user.userId,
        status: 'PENDING',
      },
    });

    if (pendingApplication) {
      return errorResponse(
        'You already have a pending loan application',
        409
      );
    }

    // Create loan application
    const application = await prisma.loanApplication.create({
      data: {
        borrower_id: user.userId,
        product_id,
        requested_amount,
        purpose,
        status: 'PENDING',
      },
      include: {
        product: true,
      },
    });

    return createdResponse(
      {
        id: application.id,
        product: application.product.name,
        requested_amount: application.requested_amount,
        status: application.status,
        created_at: application.created_at,
      },
      'Loan application submitted successfully'
    );
  } catch (error: any) {
    console.error('Apply loan error:', error);
    return errorResponse(error.message || 'Failed to apply for loan');
  }
}

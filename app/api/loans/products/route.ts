import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/utils/middleware';
import {
  successResponse,
  createdResponse,
  errorResponse,
  forbiddenResponse,
} from '@/lib/utils/api-response';

// Get all loan products
export async function GET(request: NextRequest) {
  try {
    const products = await prisma.loanProduct.findMany({
      where: { is_active: true },
      orderBy: { created_at: 'desc' },
    });

    return successResponse({
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        min_amount: p.min_amount,
        max_amount: p.max_amount,
        interest_rate: p.interest_rate,
        tenure_months: p.tenure_months,
        processing_fee: p.processing_fee,
      })),
    });
  } catch (error: any) {
    console.error('Get products error:', error);
    return errorResponse(error.message || 'Failed to get loan products');
  }
}

// Create loan product (Admin only)
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
      return forbiddenResponse('Only admins can create loan products');
    }

    const body = await request.json();

    // Create product
    const product = await prisma.loanProduct.create({
      data: {
        name: body.name,
        min_amount: body.min_amount,
        max_amount: body.max_amount,
        interest_rate: body.interest_rate,
        tenure_months: body.tenure_months,
        processing_fee: body.processing_fee,
      },
    });

    return createdResponse(product, 'Loan product created successfully');
  } catch (error: any) {
    console.error('Create product error:', error);
    return errorResponse(error.message || 'Failed to create loan product');
  }
}

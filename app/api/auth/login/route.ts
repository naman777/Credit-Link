import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { verifyPassword, generateToken } from '@/lib/utils/auth';
import { loginSchema } from '@/lib/validators/auth';
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  unauthorizedResponse,
} from '@/lib/utils/api-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return validationErrorResponse(
        validationResult.error.errors[0].message
      );
    }

    const { email, password } = validationResult.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        wallet: true,
        credit_score: true,
      },
    });

    if (!user) {
      return unauthorizedResponse('Invalid email or password');
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      return errorResponse('Account is suspended or inactive', 403);
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return unauthorizedResponse('Invalid email or password');
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return successResponse(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
          wallet: {
            id: user.wallet?.id,
            balance: user.wallet?.current_balance,
          },
          credit_score: {
            score: user.credit_score?.score,
            total_loans: user.credit_score?.total_loans_taken,
          },
        },
        token,
      },
      'Login successful'
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return errorResponse(error.message || 'Failed to login');
  }
}

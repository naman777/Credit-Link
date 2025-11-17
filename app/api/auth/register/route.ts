import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { hashPassword, generateToken } from '@/lib/utils/auth';
import { registerSchema } from '@/lib/validators/auth';
import {
  createdResponse,
  errorResponse,
  validationErrorResponse,
} from '@/lib/utils/api-response';
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return validationErrorResponse(
        validationResult.error.issues[0].message
      );
    }

    const { name, email, phone, password, role } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      return errorResponse('User with this email or phone already exists', 409);
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Create user with wallet and credit score
    const user = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          phone,
          password_hash,
          role,
        },
      });

      // Create wallet for the user
      await tx.wallet.create({
        data: {
          user_id: newUser.id,
          current_balance: 0,
        },
      });

      // Create credit score for the user
      await tx.creditScore.create({
        data: {
          user_id: newUser.id,
          score: 600, // Default starting score
        },
      });

      return newUser;
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return createdResponse(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
        },
        token,
      },
      'User registered successfully'
    );
  } catch (error: any) {
    console.error('Register error:', error);
    return errorResponse(error.message || 'Failed to register user');
  }
}

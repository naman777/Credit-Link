import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/utils/middleware';
import { apiResponse, apiError } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticate(request);
    if (!('user' in authResult)) return authResult;

    const { user } = authResult;
    if (!requireRole(user, ['ADMIN'])) {
      return apiError('Unauthorized', 403);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          created_at: true,
          kyc_documents: {
            select: { verification_status: true },
            take: 1,
            orderBy: { created_at: 'desc' }
          },
          wallet: {
            select: { current_balance: true }
          },
          credit_score: {
            select: { score: true }
          },
          _count: {
            select: {
              loan_applications: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ]);

    return apiResponse({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return apiError('Failed to fetch users', 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authResult = await authenticate(request);
    if (!('user' in authResult)) return authResult;

    const { user } = authResult;
    if (!requireRole(user, ['ADMIN'])) {
      return apiError('Unauthorized', 403);
    }

    const body = await request.json();
    const { userId, status, role } = body;

    if (!userId) {
      return apiError('User ID is required', 400);
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (role) updateData.role = role;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true
      }
    });

    return apiResponse(updatedUser, 'User updated successfully');
  } catch (error) {
    console.error('Admin update user error:', error);
    return apiError('Failed to update user', 500);
  }
}

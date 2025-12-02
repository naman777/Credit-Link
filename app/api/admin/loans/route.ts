import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/utils/middleware';
import { apiResponse, apiError } from '@/lib/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticate(request);
    if (!('user' in authResult)) return authResult;

    const { user } = authResult;
    if (!requireRole(user, ['ADMIN', 'LENDER'])) {
      return apiError('Unauthorized', 403);
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PENDING';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    if (status !== 'ALL') {
      where.status = status;
    }

    const [applications, total] = await Promise.all([
      prisma.loanApplication.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          borrower: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              credit_score: {
                select: { score: true }
              },
              kyc_documents: {
                select: { verification_status: true },
                take: 1,
                orderBy: { created_at: 'desc' }
              }
            }
          },
          product: {
            select: {
              name: true,
              interest_rate: true,
              tenure_months: true
            }
          },
          contract: {
            select: {
              id: true,
              status: true,
              start_date: true
            }
          }
        }
      }),
      prisma.loanApplication.count({ where })
    ]);

    return apiResponse({
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Admin loans list error:', error);
    return apiError('Failed to fetch loan applications', 500);
  }
}

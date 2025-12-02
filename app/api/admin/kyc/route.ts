import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { authenticate, requireRole } from '@/lib/utils/middleware';
import { apiResponse, apiError } from '@/lib/utils/api-response';

export async function GET(request: Request) {
  try {
    const authResult = await authenticate(request);
    if (authResult instanceof NextResponse) return authResult;

    const roleCheck = requireRole(authResult, ['ADMIN']);
    if (roleCheck) return roleCheck;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PENDING';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    if (status !== 'ALL') {
      where.verification_status = status;
    }

    const [documents, total] = await Promise.all([
      prisma.kYCDocument.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              created_at: true
            }
          }
        }
      }),
      prisma.kYCDocument.count({ where })
    ]);

    return apiResponse({
      documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Admin KYC list error:', error);
    return apiError('Failed to fetch KYC documents', 500);
  }
}

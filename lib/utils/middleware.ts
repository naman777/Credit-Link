import { NextRequest } from 'next/server';
import { verifyToken, extractToken, JWTPayload } from './auth';
import { unauthorizedResponse } from './api-response';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * Middleware to verify JWT token and attach user to request
 */
export async function authenticate(
  request: NextRequest
): Promise<{ user: JWTPayload } | Response> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader);

    if (!token) {
      return unauthorizedResponse('No token provided');
    }

    const user = verifyToken(token);
    return { user };
  } catch (error) {
    return unauthorizedResponse('Invalid or expired token');
  }
}

/**
 * Check if user has required role
 */
export function requireRole(user: JWTPayload, allowedRoles: string[]): boolean {
  return allowedRoles.includes(user.role);
}

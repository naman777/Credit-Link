import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export function successResponse<T>(data: T, message?: string) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
      message,
    },
    { status: 200 }
  );
}

export function createdResponse<T>(data: T, message?: string) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
      message,
    },
    { status: 201 }
  );
}

export function errorResponse(error: string, statusCode: number = 500) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error,
    },
    { status: statusCode }
  );
}

export function unauthorizedResponse(message: string = 'Unauthorized') {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message: string = 'Forbidden') {
  return errorResponse(message, 403);
}

export function notFoundResponse(message: string = 'Resource not found') {
  return errorResponse(message, 404);
}

export function validationErrorResponse(message: string) {
  return errorResponse(message, 400);
}

// Aliases for convenience
export const apiResponse = successResponse;
export const apiError = errorResponse;

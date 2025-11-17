import { z } from 'zod';

export const depositSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
});

export const withdrawSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
});

export const makeRepaymentSchema = z.object({
  schedule_id: z.string().uuid('Invalid schedule ID'),
  amount: z.number().positive('Amount must be positive'),
});

export type DepositInput = z.infer<typeof depositSchema>;
export type WithdrawInput = z.infer<typeof withdrawSchema>;
export type MakeRepaymentInput = z.infer<typeof makeRepaymentSchema>;

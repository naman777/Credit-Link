import { prisma } from '@/lib/db/prisma';
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Calculate EMI using reducing balance method
 */
export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureMonths: number
): number {
  const monthlyRate = annualRate / 12 / 100;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi * 100) / 100;
}

/**
 * Generate repayment schedule for a loan
 */
export function generateRepaymentSchedule(
  principal: number,
  annualRate: number,
  tenureMonths: number,
  startDate: Date
) {
  const monthlyRate = annualRate / 12 / 100;
  const emi = calculateEMI(principal, annualRate, tenureMonths);

  const schedule = [];
  let balance = principal;

  for (let i = 1; i <= tenureMonths; i++) {
    const interestComponent = balance * monthlyRate;
    const principalComponent = emi - interestComponent;

    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    schedule.push({
      installment_number: i,
      due_date: dueDate,
      amount_due: emi,
      principal_component: Math.round(principalComponent * 100) / 100,
      interest_component: Math.round(interestComponent * 100) / 100,
      status: 'PENDING' as const,
    });

    balance -= principalComponent;
  }

  return schedule;
}

/**
 * Disburse a loan - Transfer money to borrower and create repayment schedule
 */
export async function disburseLoan(applicationId: string, lenderId: string) {
  return await prisma.$transaction(async (tx: any) => {
    // Get application with product details
    const application = await tx.loanApplication.findUnique({
      where: { id: applicationId },
      include: {
        product: true,
        borrower: {
          include: {
            wallet: true,
            credit_score: true,
          },
        },
      },
    });

    if (!application) {
      throw new Error('Loan application not found');
    }

    if (application.status !== 'APPROVED') {
      throw new Error('Loan application is not approved');
    }

    // Check if contract already exists
    const existingContract = await tx.loanContract.findUnique({
      where: { application_id: applicationId },
    });

    if (existingContract) {
      throw new Error('Loan already disbursed');
    }

    // Get lender wallet
    const lenderWallet = await tx.wallet.findUnique({
      where: { user_id: lenderId },
    });

    if (!lenderWallet) {
      throw new Error('Lender wallet not found');
    }

    // Check if lender has sufficient balance
    const totalAmount =
      Number(application.requested_amount) +
      Number(application.product.processing_fee);

    if (Number(lenderWallet.current_balance) < totalAmount) {
      throw new Error('Lender has insufficient balance');
    }

    // Calculate loan end date
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + application.product.tenure_months);

    // Create loan contract
    const contract = await tx.loanContract.create({
      data: {
        application_id: applicationId,
        lender_id: lenderId,
        principal_amount: application.requested_amount,
        interest_rate: application.product.interest_rate,
        tenure_months: application.product.tenure_months,
        start_date: startDate,
        end_date: endDate,
        status: 'ACTIVE',
      },
    });

    // Generate and create repayment schedule
    const schedule = generateRepaymentSchedule(
      Number(application.requested_amount),
      Number(application.product.interest_rate),
      application.product.tenure_months,
      startDate
    );

    await tx.repaymentSchedule.createMany({
      data: schedule.map((s) => ({
        ...s,
        loan_id: contract.id,
      })),
    });

    // Deduct from lender wallet (principal + processing fee)
    await tx.wallet.update({
      where: { id: lenderWallet.id },
      data: {
        current_balance: {
          decrement: totalAmount,
        },
      },
    });

    // Create lender debit transaction
    await tx.walletTransaction.create({
      data: {
        wallet_id: lenderWallet.id,
        user_id: lenderId,
        tx_type: 'DEBIT',
        amount: totalAmount,
        reference_type: 'LOAN_DISBURSAL',
        reference_id: contract.id,
        description: `Loan disbursed to ${application.borrower.name}`,
      },
    });

    // Credit borrower wallet
    await tx.wallet.update({
      where: { id: application.borrower.wallet!.id },
      data: {
        current_balance: {
          increment: Number(application.requested_amount),
        },
      },
    });

    // Create borrower credit transaction
    await tx.walletTransaction.create({
      data: {
        wallet_id: application.borrower.wallet!.id,
        user_id: application.borrower_id,
        tx_type: 'CREDIT',
        amount: Number(application.requested_amount),
        reference_type: 'LOAN_DISBURSAL',
        reference_id: contract.id,
        description: `Loan received from lender`,
      },
    });

    // Update credit score - increment total loans
    await tx.creditScore.update({
      where: { user_id: application.borrower_id },
      data: {
        total_loans_taken: {
          increment: 1,
        },
      },
    });

    // Create notifications
    await tx.notificationLog.createMany({
      data: [
        {
          user_id: application.borrower_id,
          message: `Loan of ₹${application.requested_amount} has been disbursed to your wallet`,
          type: 'LOAN_APPROVED',
        },
        {
          user_id: lenderId,
          message: `Loan of ₹${application.requested_amount} has been disbursed`,
          type: 'WALLET_DEBIT',
        },
      ],
    });

    return contract;
  });
}

/**
 * Calculate credit score based on repayment history
 */
export async function recalculateCreditScore(userId: string) {
  return await prisma.$transaction(async (tx: any) => {
    const creditScore = await tx.creditScore.findUnique({
      where: { user_id: userId },
    });

    if (!creditScore) {
      throw new Error('Credit score not found');
    }

    // Simple scoring formula:
    // Base: 600
    // +10 for each on-time payment
    // -50 for each default
    // -20 for each late payment
    const baseScore = 600;
    const onTimeBonus = Number(creditScore.on_time_payments) * 10;
    const defaultPenalty = Number(creditScore.defaults_count) * 50;
    const latePenalty = Number(creditScore.late_payments) * 20;

    const newScore = Math.max(
      300,
      Math.min(850, baseScore + onTimeBonus - defaultPenalty - latePenalty)
    );

    return await tx.creditScore.update({
      where: { user_id: userId },
      data: {
        score: newScore,
        last_updated: new Date(),
      },
    });
  });
}

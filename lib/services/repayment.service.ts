import { prisma } from '@/lib/db/prisma';
import { recalculateCreditScore } from './loan.service';

/**
 * Make a repayment for an EMI
 */
export async function makeRepayment(
  userId: string,
  scheduleId: string,
  amount: number
) {
  return await prisma.$transaction(async (tx: any) => {
    // Get repayment schedule
    const schedule = await tx.repaymentSchedule.findUnique({
      where: { id: scheduleId },
      include: {
        loan: {
          include: {
            application: {
              include: {
                borrower: true,
              },
            },
            lender: true,
          },
        },
      },
    });

    if (!schedule) {
      throw new Error('Repayment schedule not found');
    }

    // Check if user is the borrower
    if (schedule.loan.application.borrower_id !== userId) {
      throw new Error('Unauthorized: You are not the borrower');
    }

    // Check if already paid
    if (schedule.status === 'PAID') {
      throw new Error('This EMI is already paid');
    }

    // Get borrower wallet
    const borrowerWallet = await tx.wallet.findUnique({
      where: { user_id: userId },
    });

    if (!borrowerWallet) {
      throw new Error('Wallet not found');
    }

    // Calculate late fee if overdue
    let lateFee = 0;
    const today = new Date();
    const isOverdue = today > schedule.due_date;

    if (isOverdue && schedule.status === 'OVERDUE') {
      // Calculate late fee: 2% of EMI amount per day
      const daysLate = Math.floor(
        (today.getTime() - schedule.due_date.getTime()) / (1000 * 60 * 60 * 24)
      );
      lateFee = Math.round(Number(schedule.amount_due) * 0.02 * daysLate * 100) / 100;
    }

    const totalAmount = amount + lateFee;

    // Check if sufficient balance
    if (Number(borrowerWallet.current_balance) < totalAmount) {
      throw new Error('Insufficient balance');
    }

    // Debit from borrower wallet
    await tx.wallet.update({
      where: { id: borrowerWallet.id },
      data: {
        current_balance: {
          decrement: totalAmount,
        },
      },
    });

    // Credit to lender wallet
    const lenderWallet = await tx.wallet.findUnique({
      where: { user_id: schedule.loan.lender_id },
    });

    if (!lenderWallet) {
      throw new Error('Lender wallet not found');
    }

    await tx.wallet.update({
      where: { id: lenderWallet.id },
      data: {
        current_balance: {
          increment: totalAmount,
        },
      },
    });

    // Create wallet transactions
    await tx.walletTransaction.createMany({
      data: [
        {
          wallet_id: borrowerWallet.id,
          user_id: userId,
          tx_type: 'DEBIT',
          amount: totalAmount,
          reference_type: 'REPAYMENT',
          reference_id: scheduleId,
          description: `EMI payment for loan ${schedule.loan_id}`,
        },
        {
          wallet_id: lenderWallet.id,
          user_id: schedule.loan.lender_id,
          tx_type: 'CREDIT',
          amount: totalAmount,
          reference_type: 'REPAYMENT',
          reference_id: scheduleId,
          description: `EMI received from ${schedule.loan.application.borrower.name}`,
        },
      ],
    });

    // Update repayment schedule
    const updatedSchedule = await tx.repaymentSchedule.update({
      where: { id: scheduleId },
      data: {
        status: 'PAID',
        paid_on: new Date(),
        late_fee: lateFee,
      },
    });

    // Create repayment transaction
    const repaymentTx = await tx.repaymentTransaction.create({
      data: {
        schedule_id: scheduleId,
        paid_amount: amount,
        late_fee: lateFee,
      },
    });

    // Update credit score
    const isOnTime = !isOverdue;
    await tx.creditScore.update({
      where: { user_id: userId },
      data: {
        on_time_payments: isOnTime
          ? { increment: 1 }
          : undefined,
        late_payments: !isOnTime
          ? { increment: 1 }
          : undefined,
      },
    });

    // Check if all EMIs are paid - close the loan
    const remainingEMIs = await tx.repaymentSchedule.count({
      where: {
        loan_id: schedule.loan_id,
        status: { not: 'PAID' },
      },
    });

    if (remainingEMIs === 0) {
      await tx.loanContract.update({
        where: { id: schedule.loan_id },
        data: {
          status: 'CLOSED',
        },
      });
    }

    // Create notifications
    await tx.notificationLog.createMany({
      data: [
        {
          user_id: userId,
          message: `EMI payment of ₹${totalAmount} successful${
            lateFee > 0 ? ` (includes late fee of ₹${lateFee})` : ''
          }`,
          type: 'REPAYMENT_SUCCESS',
        },
        {
          user_id: schedule.loan.lender_id,
          message: `EMI payment of ₹${totalAmount} received from ${schedule.loan.application.borrower.name}`,
          type: 'WALLET_CREDIT',
        },
      ],
    });

    // Recalculate credit score
    await recalculateCreditScore(userId);

    return { updatedSchedule, repaymentTx, lateFee };
  });
}

/**
 * Mark overdue EMIs - should be run daily
 */
export async function markOverdueEMIs() {
  const today = new Date();

  return await prisma.repaymentSchedule.updateMany({
    where: {
      due_date: { lt: today },
      status: 'PENDING',
    },
    data: {
      status: 'OVERDUE',
    },
  });
}

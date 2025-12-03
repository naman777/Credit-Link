// Create test accounts for borrower, lender, and admin
// Usage: node prisma/create_test_accounts.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {
  console.log('\n========================================');
  console.log('CREATING TEST ACCOUNTS');
  console.log('========================================\n');

  // Common password for all test accounts
  const testPassword = 'Test@123';
  const hashedPassword = await hashPassword(testPassword);

  // 1. Create Borrower Account
  const borrower = await prisma.user.upsert({
    where: { email: 'borrower@test.com' },
    update: {
      password_hash: hashedPassword,
    },
    create: {
      id: 'test-borrower-001',
      name: 'Test Borrower',
      email: 'borrower@test.com',
      phone: '9999900001',
      password_hash: hashedPassword,
      role: 'BORROWER',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Borrower account created/updated:', borrower.email);

  // Create wallet for borrower
  await prisma.wallet.upsert({
    where: { user_id: borrower.id },
    update: {},
    create: {
      user_id: borrower.id,
      current_balance: 25000,
    },
  });
  console.log('   └─ Wallet created with balance: ₹25,000');

  // Create credit score for borrower
  await prisma.creditScore.upsert({
    where: { user_id: borrower.id },
    update: {},
    create: {
      user_id: borrower.id,
      score: 700,
      total_loans_taken: 2,
      on_time_payments: 10,
      late_payments: 1,
      defaults_count: 0,
    },
  });
  console.log('   └─ Credit Score: 700 (Good)');

  // Create KYC for borrower (check if exists first)
  const existingBorrowerKyc = await prisma.kYCDocument.findFirst({
    where: { user_id: borrower.id, doc_type: 'AADHAAR' },
  });
  if (!existingBorrowerKyc) {
    await prisma.kYCDocument.create({
      data: {
        user_id: borrower.id,
        doc_type: 'AADHAAR',
        doc_number: '9999-8888-7777',
        verification_status: 'VERIFIED',
        verified_at: new Date(),
      },
    });
  }
  console.log('   └─ KYC: AADHAAR Verified');

  // 2. Create Lender Account
  const lender = await prisma.user.upsert({
    where: { email: 'lender@test.com' },
    update: {
      password_hash: hashedPassword,
    },
    create: {
      id: 'test-lender-001',
      name: 'Test Lender',
      email: 'lender@test.com',
      phone: '9999900002',
      password_hash: hashedPassword,
      role: 'LENDER',
      status: 'ACTIVE',
    },
  });
  console.log('\n✅ Lender account created/updated:', lender.email);

  // Create wallet for lender
  await prisma.wallet.upsert({
    where: { user_id: lender.id },
    update: {},
    create: {
      user_id: lender.id,
      current_balance: 500000,
    },
  });
  console.log('   └─ Wallet created with balance: ₹5,00,000');

  // Create KYC for lender (check if exists first)
  const existingLenderKyc = await prisma.kYCDocument.findFirst({
    where: { user_id: lender.id, doc_type: 'PAN' },
  });
  if (!existingLenderKyc) {
    await prisma.kYCDocument.create({
      data: {
        user_id: lender.id,
        doc_type: 'PAN',
        doc_number: 'TESTL1234P',
        verification_status: 'VERIFIED',
        verified_at: new Date(),
      },
    });
  }
  console.log('   └─ KYC: PAN Verified');

  // 3. Create Admin Account
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {
      password_hash: hashedPassword,
    },
    create: {
      id: 'test-admin-001',
      name: 'Test Admin',
      email: 'admin@test.com',
      phone: '9999900003',
      password_hash: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('\n✅ Admin account created/updated:', admin.email);

  // Create wallet for admin
  await prisma.wallet.upsert({
    where: { user_id: admin.id },
    update: {},
    create: {
      user_id: admin.id,
      current_balance: 0,
    },
  });
  console.log('   └─ Wallet created');

  // ========================================
  // ADD LOAN AND TRANSACTION DATA
  // ========================================
  console.log('\n========================================');
  console.log('ADDING LOAN & TRANSACTION DATA');
  console.log('========================================\n');

  // Get a loan product
  const loanProduct = await prisma.loanProduct.findFirst({
    where: { is_active: true },
  });

  if (!loanProduct) {
    console.log('⚠️  No loan product found. Skipping loan data.');
  } else {
    // Create loan application for borrower (funded by test lender)
    const existingApp = await prisma.loanApplication.findFirst({
      where: { borrower_id: borrower.id, product_id: loanProduct.id },
    });

    let loanApplication;
    if (!existingApp) {
      loanApplication = await prisma.loanApplication.create({
        data: {
          id: 'test-loan-app-001',
          borrower_id: borrower.id,
          product_id: loanProduct.id,
          requested_amount: 50000,
          purpose: 'Home improvement and renovation',
          status: 'APPROVED',
          reviewed_at: new Date('2025-09-20'),
        },
      });
      console.log('✅ Loan Application created for borrower');
    } else {
      loanApplication = existingApp;
      console.log('✅ Loan Application already exists');
    }

    // Create loan contract (lender funds the borrower)
    const existingContract = await prisma.loanContract.findFirst({
      where: { application_id: loanApplication.id },
    });

    let loanContract;
    if (!existingContract) {
      const startDate = new Date('2025-10-01');
      const endDate = new Date('2026-10-01');

      loanContract = await prisma.loanContract.create({
        data: {
          id: 'test-loan-contract-001',
          application_id: loanApplication.id,
          lender_id: lender.id,
          principal_amount: 50000,
          interest_rate: 12,
          tenure_months: 12,
          start_date: startDate,
          end_date: endDate,
          status: 'ACTIVE',
        },
      });
      console.log('✅ Loan Contract created (Lender → Borrower)');

      // Create repayment schedule (12 EMIs)
      const scheduleData = [];
      for (let i = 1; i <= 12; i++) {
        const dueDate = new Date(startDate);
        dueDate.setMonth(dueDate.getMonth() + i);
        
        const principal = 4442.37 - (50000 * 0.12 / 12) * (13 - i) / 12;
        const interest = 4442.37 - principal;

        scheduleData.push({
          id: `test-schedule-${String(i).padStart(3, '0')}`,
          loan_id: loanContract.id,
          installment_number: i,
          due_date: dueDate,
          amount_due: 4442.37,
          principal_component: Math.round(principal * 100) / 100,
          interest_component: Math.round(interest * 100) / 100,
          status: i <= 2 ? 'PAID' : (i === 3 ? 'OVERDUE' : 'PENDING'),
          paid_on: i <= 2 ? new Date(dueDate.getTime() - 86400000) : null,
          paid_amount: i <= 2 ? 4442.37 : null,
        });
      }

      await prisma.repaymentSchedule.createMany({
        data: scheduleData,
        skipDuplicates: true,
      });
      console.log('✅ Repayment Schedule created (12 EMIs)');

      // Create repayment transactions for paid EMIs
      for (let i = 1; i <= 2; i++) {
        await prisma.repaymentTransaction.create({
          data: {
            id: `test-repay-txn-${String(i).padStart(3, '0')}`,
            schedule_id: `test-schedule-${String(i).padStart(3, '0')}`,
            paid_amount: 4442.37,
            late_fee: 0,
            paid_at: new Date(`2025-${9 + i}-28`),
          },
        });
      }
      console.log('✅ Repayment Transactions created (2 EMIs paid)');

    } else {
      loanContract = existingContract;
      console.log('✅ Loan Contract already exists');
    }

    // Get wallets for transactions
    const borrowerWallet = await prisma.wallet.findUnique({ where: { user_id: borrower.id } });
    const lenderWallet = await prisma.wallet.findUnique({ where: { user_id: lender.id } });

    // Create wallet transactions for both borrower and lender
    const existingTxn = await prisma.walletTransaction.findFirst({
      where: { user_id: borrower.id, reference_type: 'LOAN_DISBURSAL' },
    });

    if (!existingTxn && borrowerWallet && lenderWallet) {
      // Loan disbursement to borrower
      await prisma.walletTransaction.create({
        data: {
          wallet_id: borrowerWallet.id,
          user_id: borrower.id,
          tx_type: 'CREDIT',
          amount: 50000,
          reference_type: 'LOAN_DISBURSAL',
          reference_id: loanContract.id,
          description: 'Loan received from Test Lender',
          timestamp: new Date('2025-10-01'),
        },
      });

      // Debit from lender wallet
      await prisma.walletTransaction.create({
        data: {
          wallet_id: lenderWallet.id,
          user_id: lender.id,
          tx_type: 'DEBIT',
          amount: 50000,
          reference_type: 'LOAN_DISBURSAL',
          reference_id: loanContract.id,
          description: 'Loan disbursed to Test Borrower',
          timestamp: new Date('2025-10-01'),
        },
      });

      // EMI payments from borrower
      await prisma.walletTransaction.create({
        data: {
          wallet_id: borrowerWallet.id,
          user_id: borrower.id,
          tx_type: 'DEBIT',
          amount: 4442.37,
          reference_type: 'REPAYMENT',
          reference_id: 'test-schedule-001',
          description: 'EMI payment for loan',
          timestamp: new Date('2025-10-28'),
        },
      });

      await prisma.walletTransaction.create({
        data: {
          wallet_id: borrowerWallet.id,
          user_id: borrower.id,
          tx_type: 'DEBIT',
          amount: 4442.37,
          reference_type: 'REPAYMENT',
          reference_id: 'test-schedule-002',
          description: 'EMI payment for loan',
          timestamp: new Date('2025-11-28'),
        },
      });

      // EMI received by lender
      await prisma.walletTransaction.create({
        data: {
          wallet_id: lenderWallet.id,
          user_id: lender.id,
          tx_type: 'CREDIT',
          amount: 4442.37,
          reference_type: 'REPAYMENT',
          reference_id: 'test-schedule-001',
          description: 'EMI received from Test Borrower',
          timestamp: new Date('2025-10-28'),
        },
      });

      await prisma.walletTransaction.create({
        data: {
          wallet_id: lenderWallet.id,
          user_id: lender.id,
          tx_type: 'CREDIT',
          amount: 4442.37,
          reference_type: 'REPAYMENT',
          reference_id: 'test-schedule-002',
          description: 'EMI received from Test Borrower',
          timestamp: new Date('2025-11-28'),
        },
      });

      // Deposit transactions
      await prisma.walletTransaction.create({
        data: {
          wallet_id: lenderWallet.id,
          user_id: lender.id,
          tx_type: 'CREDIT',
          amount: 500000,
          reference_type: 'DEPOSIT',
          description: 'Initial wallet deposit',
          timestamp: new Date('2025-09-01'),
        },
      });

      await prisma.walletTransaction.create({
        data: {
          wallet_id: borrowerWallet.id,
          user_id: borrower.id,
          tx_type: 'CREDIT',
          amount: 25000,
          reference_type: 'DEPOSIT',
          description: 'Wallet deposit',
          timestamp: new Date('2025-09-15'),
        },
      });

      console.log('✅ Wallet Transactions created for both accounts');
    } else {
      console.log('✅ Wallet Transactions already exist');
    }

    // Create notifications
    const existingNotif = await prisma.notificationLog.findFirst({
      where: { user_id: borrower.id },
    });

    if (!existingNotif) {
      await prisma.notificationLog.createMany({
        data: [
          {
            user_id: borrower.id,
            type: 'LOAN_APPROVED',
            message: 'Congratulations! Your loan of ₹50,000 has been approved.',
            is_read: true,
          },
          {
            user_id: borrower.id,
            type: 'WALLET_CREDIT',
            message: 'Loan amount of ₹50,000 has been credited to your wallet.',
            is_read: true,
          },
          {
            user_id: borrower.id,
            type: 'REPAYMENT_SUCCESS',
            message: 'EMI payment of ₹4,442.37 successful.',
            is_read: true,
          },
          {
            user_id: borrower.id,
            type: 'EMI_DUE',
            message: 'EMI of ₹4,442.37 is due on 2025-12-01. Please pay on time.',
            is_read: false,
          },
          {
            user_id: lender.id,
            type: 'WALLET_CREDIT',
            message: 'EMI payment of ₹4,442.37 received from Test Borrower.',
            is_read: true,
          },
          {
            user_id: lender.id,
            type: 'WALLET_DEBIT',
            message: 'You have successfully funded a loan of ₹50,000 to Test Borrower.',
            is_read: true,
          },
        ],
        skipDuplicates: true,
      });
      console.log('✅ Notifications created');
    } else {
      console.log('✅ Notifications already exist');
    }

    // Update credit score with loan data
    await prisma.creditScore.update({
      where: { user_id: borrower.id },
      data: {
        total_loans_taken: 1,
        on_time_payments: 2,
        late_payments: 0,
        score: 720,
      },
    });
    console.log('✅ Credit Score updated');
  }

  // Print credentials summary
  console.log('\n========================================');
  console.log('TEST ACCOUNT CREDENTIALS');
  console.log('========================================');
  console.log('\n┌────────────┬─────────────────────┬────────────┐');
  console.log('│   ROLE     │       EMAIL         │  PASSWORD  │');
  console.log('├────────────┼─────────────────────┼────────────┤');
  console.log('│  BORROWER  │  borrower@test.com  │  Test@123  │');
  console.log('│  LENDER    │  lender@test.com    │  Test@123  │');
  console.log('│  ADMIN     │  admin@test.com     │  Test@123  │');
  console.log('└────────────┴─────────────────────┴────────────┘');
  console.log('\n✨ All accounts ready to use!\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

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

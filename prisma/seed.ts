import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@creditlink.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@creditlink.com',
      phone: '9999999999',
      password_hash: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      wallet: {
        create: {
          current_balance: 1000000
        }
      },
      credit_score: {
        create: {
          score: 850
        }
      }
    }
  });
  console.log('Created admin user:', admin.email);

  // Create Lender User
  const lenderPassword = await bcrypt.hash('lender123', 10);
  const lender = await prisma.user.upsert({
    where: { email: 'lender@creditlink.com' },
    update: {},
    create: {
      name: 'Lender User',
      email: 'lender@creditlink.com',
      phone: '8888888888',
      password_hash: lenderPassword,
      role: 'LENDER',
      status: 'ACTIVE',
      wallet: {
        create: {
          current_balance: 500000
        }
      },
      credit_score: {
        create: {
          score: 750
        }
      }
    }
  });
  console.log('Created lender user:', lender.email);

  // Create Loan Products
  const products = [
    {
      name: 'Personal Loan',
      min_amount: 10000,
      max_amount: 500000,
      interest_rate: 12.5,
      tenure_months: 12,
      processing_fee: 500
    },
    {
      name: 'Business Loan',
      min_amount: 50000,
      max_amount: 2000000,
      interest_rate: 14.0,
      tenure_months: 24,
      processing_fee: 1000
    },
    {
      name: 'Education Loan',
      min_amount: 25000,
      max_amount: 1000000,
      interest_rate: 10.5,
      tenure_months: 36,
      processing_fee: 750
    },
    {
      name: 'Emergency Loan',
      min_amount: 5000,
      max_amount: 100000,
      interest_rate: 15.0,
      tenure_months: 6,
      processing_fee: 250
    },
    {
      name: 'Home Improvement Loan',
      min_amount: 100000,
      max_amount: 1500000,
      interest_rate: 11.5,
      tenure_months: 48,
      processing_fee: 1500
    }
  ];

  for (const product of products) {
    await prisma.loanProduct.upsert({
      where: { id: product.name.toLowerCase().replace(/\s+/g, '-') },
      update: product,
      create: {
        id: product.name.toLowerCase().replace(/\s+/g, '-'),
        ...product
      }
    });
    console.log('Created loan product:', product.name);
  }

  console.log('Seeding completed!');
  console.log('\nTest Credentials:');
  console.log('Admin - email: admin@creditlink.com, password: admin123');
  console.log('Lender - email: lender@creditlink.com, password: lender123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

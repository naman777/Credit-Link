// Run queries and display results
// Usage: node prisma/run_queries.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('\n========================================');
  console.log('CREDIT-LINK DATABASE QUERIES');
  console.log('========================================\n');

  // Query 1: All Users
  console.log('📋 QUERY 1: All Registered Users');
  console.log('─'.repeat(80));
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      created_at: true,
    },
    orderBy: { created_at: 'desc' },
  });
  console.table(users.map(u => ({
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    status: u.status,
  })));

  // Query 2: User Profiles with Wallet & Credit Score
  console.log('\n📋 QUERY 2: User Profiles with Wallet & Credit Score (JOIN)');
  console.log('─'.repeat(80));
  const profiles = await prisma.user.findMany({
    where: { role: 'BORROWER' },
    select: {
      name: true,
      email: true,
      role: true,
      wallet: { select: { current_balance: true } },
      credit_score: { select: { score: true, total_loans_taken: true, on_time_payments: true, late_payments: true } },
    },
  });
  console.table(profiles.map(p => ({
    name: p.name,
    email: p.email,
    wallet_balance: p.wallet?.current_balance?.toString() || '0',
    credit_score: p.credit_score?.score || 0,
    loans_taken: p.credit_score?.total_loans_taken || 0,
    on_time: p.credit_score?.on_time_payments || 0,
    late: p.credit_score?.late_payments || 0,
  })));

  // Query 3: KYC Documents
  console.log('\n📋 QUERY 3: KYC Documents with User Details');
  console.log('─'.repeat(80));
  const kyc = await prisma.kYCDocument.findMany({
    select: {
      user: { select: { name: true, email: true } },
      doc_type: true,
      doc_number: true,
      verification_status: true,
      created_at: true,
      verified_at: true,
    },
    orderBy: { created_at: 'desc' },
  });
  console.table(kyc.map(k => ({
    user_name: k.user.name,
    doc_type: k.doc_type,
    doc_number: k.doc_number,
    status: k.verification_status,
  })));

  // Query 4: Wallets
  console.log('\n📋 QUERY 4: All Wallets with Balance');
  console.log('─'.repeat(80));
  const wallets = await prisma.wallet.findMany({
    select: {
      user: { select: { name: true, role: true } },
      current_balance: true,
      updated_at: true,
    },
    orderBy: { current_balance: 'desc' },
  });
  console.table(wallets.map(w => ({
    owner: w.user.name,
    role: w.user.role,
    balance: `Rs.${w.current_balance.toString()}`,
  })));

  // Query 5: Loan Products
  console.log('\n📋 QUERY 5: Loan Products');
  console.log('─'.repeat(80));
  const products = await prisma.loanProduct.findMany({
    orderBy: { interest_rate: 'asc' },
  });
  console.table(products.map(p => ({
    name: p.name,
    min: `Rs.${p.min_amount}`,
    max: `Rs.${p.max_amount}`,
    rate: `${p.interest_rate}%`,
    tenure: `${p.tenure_months} months`,
    fee: `Rs.${p.processing_fee}`,
    active: p.is_active ? 'YES' : 'NO',
  })));

  // Query 6: Loan Applications
  console.log('\n📋 QUERY 6: Loan Applications');
  console.log('─'.repeat(80));
  const applications = await prisma.loanApplication.findMany({
    select: {
      borrower: { select: { name: true } },
      product: { select: { name: true } },
      requested_amount: true,
      status: true,
      purpose: true,
      rejection_reason: true,
      created_at: true,
    },
    orderBy: { created_at: 'desc' },
  });
  console.table(applications.map(a => ({
    borrower: a.borrower.name,
    product: a.product.name,
    amount: `Rs.${a.requested_amount}`,
    status: a.status,
    purpose: a.purpose?.substring(0, 20) || '-',
  })));

  // Query 7: Loan Contracts
  console.log('\n📋 QUERY 7: Loan Contracts (Active Loans)');
  console.log('─'.repeat(80));
  const contracts = await prisma.loanContract.findMany({
    select: {
      application: { select: { borrower: { select: { name: true } } } },
      lender: { select: { name: true } },
      principal_amount: true,
      interest_rate: true,
      tenure_months: true,
      status: true,
      start_date: true,
      end_date: true,
    },
  });
  console.table(contracts.map(c => ({
    borrower: c.application.borrower.name,
    lender: c.lender.name,
    amount: `Rs.${c.principal_amount}`,
    rate: `${c.interest_rate}%`,
    tenure: `${c.tenure_months}m`,
    status: c.status,
  })));

  // Query 8: Repayment Schedule Sample
  console.log('\n📋 QUERY 8: Repayment Schedule (Rahul\'s First Loan)');
  console.log('─'.repeat(80));
  const schedules = await prisma.repaymentSchedule.findMany({
    where: { loan_id: 'lc000000-0000-0000-0000-000000000001' },
    orderBy: { installment_number: 'asc' },
  });
  console.table(schedules.map(s => ({
    emi_no: s.installment_number,
    due_date: s.due_date.toISOString().split('T')[0],
    amount: `Rs.${s.amount_due}`,
    principal: `Rs.${s.principal_component}`,
    interest: `Rs.${s.interest_component}`,
    status: s.status,
    paid_on: s.paid_on?.toISOString().split('T')[0] || '-',
  })));

  // Query 9: Repayment Transactions
  console.log('\n📋 QUERY 9: Repayment Transactions');
  console.log('─'.repeat(80));
  const repayments = await prisma.repaymentTransaction.findMany({
    select: {
      schedule: {
        select: {
          installment_number: true,
          loan: {
            select: {
              principal_amount: true,
              application: { select: { borrower: { select: { name: true } } } },
            },
          },
        },
      },
      paid_amount: true,
      late_fee: true,
      paid_at: true,
    },
    orderBy: { paid_at: 'desc' },
  });
  console.table(repayments.map(r => ({
    borrower: r.schedule.loan.application.borrower.name,
    loan_amount: `Rs.${r.schedule.loan.principal_amount}`,
    emi_no: r.schedule.installment_number,
    paid: `Rs.${r.paid_amount}`,
    late_fee: `Rs.${r.late_fee}`,
    paid_at: r.paid_at.toISOString().split('T')[0],
  })));

  // Query 10: Credit Scores with Rating
  console.log('\n📋 QUERY 10: Credit Scores with Rating');
  console.log('─'.repeat(80));
  const scores = await prisma.creditScore.findMany({
    select: {
      user: { select: { name: true, email: true, role: true } },
      score: true,
      total_loans_taken: true,
      on_time_payments: true,
      late_payments: true,
      defaults_count: true,
    },
  });
  console.table(scores.filter(s => s.user.role === 'BORROWER').map(s => {
    let rating = 'Poor';
    if (s.score >= 750) rating = 'Excellent';
    else if (s.score >= 700) rating = 'Good';
    else if (s.score >= 650) rating = 'Fair';
    else if (s.score >= 600) rating = 'Average';
    return {
      name: s.user.name,
      score: s.score,
      rating,
      loans: s.total_loans_taken,
      on_time: s.on_time_payments,
      late: s.late_payments,
      defaults: s.defaults_count,
    };
  }));

  // Query 11: Notifications
  console.log('\n📋 QUERY 11: Recent Notifications');
  console.log('─'.repeat(80));
  const notifications = await prisma.notificationLog.findMany({
    select: {
      user: { select: { name: true } },
      message: true,
      type: true,
      is_read: true,
      created_at: true,
    },
    orderBy: { created_at: 'desc' },
    take: 10,
  });
  console.table(notifications.map(n => ({
    user: n.user.name,
    type: n.type,
    message: n.message.substring(0, 40) + '...',
    read: n.is_read ? 'YES' : 'NO',
  })));

  // Query 12: Platform Statistics
  console.log('\n📋 QUERY 12: Platform Statistics');
  console.log('─'.repeat(80));
  const [
    totalUsers,
    totalBorrowers,
    totalLenders,
    pendingKyc,
    pendingLoans,
    activeLoans,
    totalDisbursed,
    totalRepaid,
    overdueEmis,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'BORROWER' } }),
    prisma.user.count({ where: { role: 'LENDER' } }),
    prisma.kYCDocument.count({ where: { verification_status: 'PENDING' } }),
    prisma.loanApplication.count({ where: { status: 'PENDING' } }),
    prisma.loanContract.count({ where: { status: 'ACTIVE' } }),
    prisma.loanContract.aggregate({ _sum: { principal_amount: true } }),
    prisma.repaymentTransaction.aggregate({ _sum: { paid_amount: true } }),
    prisma.repaymentSchedule.count({ where: { status: 'OVERDUE' } }),
  ]);
  console.table([{
    total_users: totalUsers,
    borrowers: totalBorrowers,
    lenders: totalLenders,
    pending_kyc: pendingKyc,
    pending_loans: pendingLoans,
    active_loans: activeLoans,
    total_disbursed: `Rs.${totalDisbursed._sum.principal_amount || 0}`,
    total_repaid: `Rs.${totalRepaid._sum.paid_amount || 0}`,
    overdue_emis: overdueEmis,
  }]);

  // Query 13: Loans by Status
  console.log('\n📋 QUERY 13: Loans by Status');
  console.log('─'.repeat(80));
  const loansByStatus = await prisma.loanApplication.groupBy({
    by: ['status'],
    _count: { id: true },
    _sum: { requested_amount: true },
  });
  console.table(loansByStatus.map(l => ({
    status: l.status,
    count: l._count.id,
    total_amount: `Rs.${l._sum.requested_amount || 0}`,
  })));

  // Query 14: Top Borrowers
  console.log('\n📋 QUERY 14: Top Borrowers by Loan Amount');
  console.log('─'.repeat(80));
  const topBorrowers = await prisma.loanApplication.groupBy({
    by: ['borrower_id'],
    where: { status: 'APPROVED' },
    _count: { id: true },
    _sum: { requested_amount: true },
  });
  const borrowerDetails = await prisma.user.findMany({
    where: { id: { in: topBorrowers.map(b => b.borrower_id) } },
    select: { id: true, name: true, email: true, credit_score: { select: { score: true } } },
  });
  const borrowerMap = new Map(borrowerDetails.map(b => [b.id, b]));
  console.table(topBorrowers.map(b => {
    const user = borrowerMap.get(b.borrower_id);
    return {
      name: user?.name || 'Unknown',
      email: user?.email || '',
      total_loans: b._count.id,
      total_borrowed: `Rs.${b._sum.requested_amount || 0}`,
      credit_score: user?.credit_score?.score || 0,
    };
  }).sort((a, b) => parseFloat(b.total_borrowed.replace('Rs.', '')) - parseFloat(a.total_borrowed.replace('Rs.', ''))));

  // Query 15: Loan Summary
  console.log('\n📋 QUERY 15: Loan Summary Report');
  console.log('─'.repeat(80));
  const loanSummary = await prisma.loanContract.aggregate({
    _count: { id: true },
    _sum: { principal_amount: true },
    _avg: { principal_amount: true, interest_rate: true },
  });
  const activeCount = await prisma.loanContract.count({ where: { status: 'ACTIVE' } });
  const closedCount = await prisma.loanContract.count({ where: { status: 'CLOSED' } });
  const defaultedCount = await prisma.loanContract.count({ where: { status: 'DEFAULTED' } });
  console.table([{
    total_loans: loanSummary._count.id,
    active: activeCount,
    closed: closedCount,
    defaulted: defaultedCount,
    total_disbursed: `Rs.${loanSummary._sum.principal_amount || 0}`,
    avg_loan: `Rs.${Math.round(Number(loanSummary._avg.principal_amount) || 0)}`,
    avg_rate: `${loanSummary._avg.interest_rate?.toFixed(2) || 0}%`,
  }]);

  // Query 16: User Loan Profile
  console.log('\n📋 QUERY 16: User Loan Profiles (Complex JOIN)');
  console.log('─'.repeat(80));
  const borrowerProfiles = await prisma.user.findMany({
    where: { role: 'BORROWER' },
    select: {
      name: true,
      credit_score: { select: { score: true, total_loans_taken: true } },
      loan_applications: {
        where: { status: 'APPROVED' },
        select: {
          contract: {
            select: {
              status: true,
              principal_amount: true,
              repayment_schedule: {
                select: { status: true },
              },
            },
          },
        },
      },
    },
  });
  console.table(borrowerProfiles.map(p => {
    const score = p.credit_score?.score || 0;
    let rating = 'Poor';
    if (score >= 750) rating = 'Excellent';
    else if (score >= 700) rating = 'Good';
    else if (score >= 650) rating = 'Fair';
    else if (score >= 600) rating = 'Average';
    
    const activeLoans = p.loan_applications.filter(a => a.contract?.status === 'ACTIVE').length;
    const totalBorrowed = p.loan_applications.reduce((sum, a) => sum + Number(a.contract?.principal_amount || 0), 0);
    const pendingEmis = p.loan_applications.reduce((sum, a) => 
      sum + (a.contract?.repayment_schedule.filter(r => r.status === 'PENDING').length || 0), 0);
    const overdueEmis = p.loan_applications.reduce((sum, a) => 
      sum + (a.contract?.repayment_schedule.filter(r => r.status === 'OVERDUE').length || 0), 0);
    
    return {
      name: p.name,
      score,
      rating,
      total_loans: p.credit_score?.total_loans_taken || 0,
      active_loans: activeLoans,
      borrowed: `Rs.${totalBorrowed}`,
      pending_emi: pendingEmis,
      overdue_emi: overdueEmis,
    };
  }));

  // Query 17: Audit Logs
  console.log('\n📋 QUERY 17: Audit Logs');
  console.log('─'.repeat(80));
  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { created_at: 'desc' },
    take: 10,
  });
  const auditUserIds = auditLogs.map(a => a.user_id).filter(Boolean);
  const auditUsers = await prisma.user.findMany({
    where: { id: { in: auditUserIds } },
    select: { id: true, name: true },
  });
  const auditUserMap = new Map(auditUsers.map(u => [u.id, u.name]));
  console.table(auditLogs.map(a => ({
    user: auditUserMap.get(a.user_id || '') || 'System',
    action: a.action,
    entity: a.entity_type,
    ip: a.ip_address || '-',
    date: a.created_at.toISOString().split('T')[0],
  })));

  // Query 18: Lender Summary
  console.log('\n📋 QUERY 18: Lender Investment Summary');
  console.log('─'.repeat(80));
  const lenders = await prisma.user.findMany({
    where: { role: 'LENDER' },
    select: {
      name: true,
      wallet: { select: { current_balance: true } },
      loans_as_lender: {
        select: {
          principal_amount: true,
          status: true,
        },
      },
    },
  });
  console.table(lenders.map(l => ({
    name: l.name,
    loans_funded: l.loans_as_lender.length,
    total_invested: `Rs.${l.loans_as_lender.reduce((sum, loan) => sum + Number(loan.principal_amount), 0)}`,
    active_investments: `Rs.${l.loans_as_lender.filter(loan => loan.status === 'ACTIVE').reduce((sum, loan) => sum + Number(loan.principal_amount), 0)}`,
    wallet_balance: `Rs.${l.wallet?.current_balance || 0}`,
  })));

  // Query 19: Wallet Transactions
  console.log('\n📋 QUERY 19: Recent Wallet Transactions');
  console.log('─'.repeat(80));
  const transactions = await prisma.walletTransaction.findMany({
    select: {
      user: { select: { name: true } },
      tx_type: true,
      amount: true,
      reference_type: true,
      description: true,
      timestamp: true,
    },
    orderBy: { timestamp: 'desc' },
    take: 15,
  });
  console.table(transactions.map(t => ({
    user: t.user.name,
    type: t.tx_type,
    amount: `Rs.${t.amount}`,
    ref_type: t.reference_type || '-',
    description: (t.description || '').substring(0, 30),
  })));

  console.log('\n========================================');
  console.log('ALL QUERIES EXECUTED SUCCESSFULLY');
  console.log('========================================\n');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

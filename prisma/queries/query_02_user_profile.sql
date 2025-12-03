-- ============================================
-- CREDIT-LINK - QUERY 2: User Profile with Wallet & Credit Score
-- Section 4.1.2
-- ============================================

-- Query 2.1: Get user profile with wallet and credit score (JOIN query)
SELECT 
    u.id,
    u.name,
    u.email,
    u.phone,
    u.role,
    u.status,
    w.current_balance AS wallet_balance,
    cs.score AS credit_score,
    cs.total_loans_taken,
    cs.on_time_payments,
    cs.late_payments,
    u.created_at
FROM users u
LEFT JOIN wallets w ON u.id = w.user_id
LEFT JOIN credit_scores cs ON u.id = cs.user_id
WHERE u.role = 'BORROWER'
ORDER BY u.name;

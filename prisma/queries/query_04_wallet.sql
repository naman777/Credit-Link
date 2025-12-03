-- ============================================
-- CREDIT-LINK - QUERY 4: Wallet Balance & Transactions
-- Section 4.3
-- ============================================

-- Query 4.1: View all wallets with owner details
SELECT 
    w.id AS wallet_id,
    u.name AS owner_name,
    u.role,
    w.current_balance,
    w.updated_at AS last_updated
FROM wallets w
JOIN users u ON w.user_id = u.id
ORDER BY w.current_balance DESC;

-- Query 4.2: View wallet transactions history
SELECT 
    wt.id,
    u.name AS user_name,
    wt.tx_type,
    wt.amount,
    wt.reference_type,
    wt.description,
    wt.timestamp
FROM wallet_transactions wt
JOIN users u ON wt.user_id = u.id
ORDER BY wt.timestamp DESC
LIMIT 15;

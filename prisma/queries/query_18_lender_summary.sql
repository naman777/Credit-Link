-- ============================================
-- CREDIT-LINK - QUERY 18: Lender Investment Summary
-- Complex Query with Multiple JOINs
-- ============================================

-- Query 18.1: Lender investment summary
SELECT 
    u.name AS lender_name,
    COUNT(lc.id) AS loans_funded,
    COALESCE(SUM(lc.principal_amount), 0) AS total_invested,
    COALESCE(SUM(CASE WHEN lc.status = 'ACTIVE' THEN lc.principal_amount ELSE 0 END), 0) AS active_investments,
    w.current_balance AS wallet_balance
FROM users u
LEFT JOIN loan_contracts lc ON u.id = lc.lender_id
LEFT JOIN wallets w ON u.id = w.user_id
WHERE u.role = 'LENDER'
GROUP BY u.id, u.name, w.current_balance
ORDER BY total_invested DESC;

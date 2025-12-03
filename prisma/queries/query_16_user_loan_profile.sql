-- ============================================
-- CREDIT-LINK - QUERY 16: User Loan Profile (Complex JOIN)
-- Section 4.9.6
-- ============================================

-- Query 16.1: Get complete loan profile for borrowers
SELECT
    u.name AS user_name,
    cs.score AS credit_score,
    CASE 
        WHEN cs.score >= 750 THEN 'Excellent'
        WHEN cs.score >= 700 THEN 'Good'
        WHEN cs.score >= 650 THEN 'Fair'
        WHEN cs.score >= 600 THEN 'Average'
        ELSE 'Poor'
    END AS credit_rating,
    cs.total_loans_taken AS total_loans,
    COUNT(DISTINCT CASE WHEN lc.status = 'ACTIVE' THEN lc.id END) AS active_loans,
    COALESCE(SUM(DISTINCT lc.principal_amount), 0) AS total_borrowed,
    COUNT(CASE WHEN rs.status = 'PENDING' THEN 1 END) AS pending_emis,
    COUNT(CASE WHEN rs.status = 'OVERDUE' THEN 1 END) AS overdue_emis
FROM users u
LEFT JOIN credit_scores cs ON u.id = cs.user_id
LEFT JOIN loan_applications la ON u.id = la.borrower_id
LEFT JOIN loan_contracts lc ON la.id = lc.application_id
LEFT JOIN repayment_schedules rs ON lc.id = rs.loan_id
WHERE u.role = 'BORROWER'
GROUP BY u.name, cs.score, cs.total_loans_taken
ORDER BY cs.score DESC;

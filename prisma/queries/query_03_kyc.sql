-- ============================================
-- CREDIT-LINK - QUERY 3: KYC Documents Status
-- Section 4.2.1 & 4.2.2
-- ============================================

-- Query 3.1: View all KYC documents with user details
SELECT 
    kd.id,
    u.name AS user_name,
    u.email,
    kd.doc_type,
    kd.doc_number,
    kd.verification_status,
    kd.created_at AS submitted_at,
    kd.verified_at
FROM kyc_documents kd
JOIN users u ON kd.user_id = u.id
ORDER BY kd.created_at DESC;

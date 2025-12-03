-- ============================================
-- CREDIT-LINK - QUERY 17: Audit Logs
-- Section 4.10 - Triggers/Audit Trail
-- ============================================

-- Query 17.1: View audit logs
SELECT 
    al.id,
    u.name AS user_name,
    al.action,
    al.entity_type,
    al.entity_id,
    al.old_values,
    al.new_values,
    al.ip_address,
    al.created_at
FROM audit_logs al
LEFT JOIN users u ON al.user_id = u.id
ORDER BY al.created_at DESC;

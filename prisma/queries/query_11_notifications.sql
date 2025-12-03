-- ============================================
-- CREDIT-LINK - QUERY 11: Notifications
-- Section 4.8
-- ============================================

-- Query 11.1: View all notifications with user details
SELECT 
    nl.id,
    u.name AS user_name,
    nl.message,
    nl.type,
    nl.is_read,
    nl.created_at
FROM notification_logs nl
JOIN users u ON nl.user_id = u.id
ORDER BY nl.created_at DESC
LIMIT 15;

-- Query 11.2: Count unread notifications per user
SELECT 
    u.name,
    COUNT(*) AS unread_notifications
FROM notification_logs nl
JOIN users u ON nl.user_id = u.id
WHERE nl.is_read = FALSE
GROUP BY u.name
ORDER BY unread_notifications DESC;

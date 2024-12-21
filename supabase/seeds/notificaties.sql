INSERT INTO i_notifications (board, port, status, message, send_sms, sms_sent) VALUES
(1, 8080, 'online', 'Systeem werkt naar behoren', FALSE, FALSE),
(2, 9090, 'error', 'Fout in verbinding gedetecteerd', TRUE, FALSE),
(3, 7070, 'maintenance', 'Onderhoud gepland op systeem', FALSE, FALSE);
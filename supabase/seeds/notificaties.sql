INSERT INTO i_notifications (board, port, status, message, send_sms, sms_sent, mold_id, machine_id) VALUES
(1, 8080, 'online', 'Systeem werkt naar behoren', FALSE, FALSE, 1, 4),
(2, 9090, 'error', 'Fout in verbinding gedetecteerd', TRUE, FALSE, 1, 4),
(3, 7070, 'maintenance', 'Onderhoud gepland op systeem', FALSE, FALSE, 1, 5),
(4, 6060, 'milestone', 'Systeem heeft mijlpaal bereikt', TRUE, FALSE, 1, 6);
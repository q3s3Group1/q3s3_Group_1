-- Insert demo notifications with different statuses and SMS options
INSERT INTO public.i_notifications (status, message, detected_at, send_sms, sms_sent, read_at, mold_id, machine_id)
VALUES 
  ('offline', 'It exploded!', '2020-09-5 14:30:00', false, false, NULL, 174, 8),
  ('online', 'Back online', '2020-09-5 14:35:00', false, false, NULL, 174, 8),
  ('error', 'Error detected', '2020-09-4 14:40:00', false, false, NULL, 174, 8),
  ('maintenance', 'Maintenance required', '2020-09-5 14:50:00', false, false, NULL, 174, 8),
  ('milestone', 'Milestone reached', '2020-09-5 14:45:00', false, false, NULL, 174, 8);

  -- Insert demo maintenance milestones for molds
INSERT INTO public.i_mold_maintenance_milestones (mold_id, milestone_shots, maintenance_type, send_sms, created_at, updated_at, sms_sent)
VALUES
  (1, 174, 'Routine Cleaning', false, '2025-01-01 08:30:00', '2025-01-01 08:30:00', false),
  (2, 173, 'Lubrication', true, '2025-01-02 09:45:00', '2025-01-05 14:20:00', false),
  (3, 173, 'Inspection', false, '2025-01-03 12:00:00', '2025-01-03 12:00:00', false),
  (4, 173, 'Repair', true, '2025-01-04 10:10:00', '2025-01-06 16:40:00', false),
  (5, 173, 'Routine Cleaning', false, '2025-01-05 14:50:00', '2025-01-05 14:50:00', false),
  (6, 173, 'Urgent Repair', true, '2025-01-06 15:00:00', '2025-01-06 18:30:00', false);

-- Insert demo notifications with different statuses and SMS options
INSERT INTO public.i_notifications (status, message, detected_at, send_sms, sms_sent, read_at, mold_id, machine_id)
VALUES 
  ('offline', 'It exploded!', '2020-09-5 14:30:00', false, false, NULL, 174, 8),
  ('online', 'Back online', '2020-09-5 14:35:00', false, false, NULL, 174, 8),
  ('error', 'Error detected', '2020-09-4 14:40:00', false, false, NULL, 174, 8),
  ('maintenance', 'Maintenance required', '2020-09-5 14:50:00', false, false, NULL, 174, 8),
  ('milestone', 'Milestone reached', '2020-09-5 14:45:00', false, false, NULL, 174, 8);

INSERT INTO "public"."i_mechanics" ("id", "name", "specialization") VALUES ('2', 'Jan de Vries', 'Hydraulische systemen'), ('3', 'Linda Kuipers', 'Matrijstechnicus'), ('4', 'Jeroen Verkerk', 'Onderhoudstechnicus'), ('5', 'Nick van Rijn', 'Koelingsspecialist matrijzen'), ('6', 'Sanne Groen', 'CNC-operator'), ('7', 'Rik van der Zanden', 'Smeltkanaaltechnicus'), ('8', 'Lars Hoogendorn', 'Preventief onderhoudsspecialist'), ('9', 'Romy de Vries', 'Revisietechnicus kunststofmatrijzen');

INSERT INTO "public"."i_maintenance_groups" ("created_at", "name", "id") VALUES ('2025-01-07 11:38:11.601763+00', 'Group', '7'), ('2025-01-07 11:45:01.396119+00', 'Group', '8');

INSERT INTO "public"."i_maintenance_plans" ("id", "planned_date", "mold_id", "maintenance_type", "description", "assigned_to", "status", "maintenance_action", "group_id") VALUES ('11', '2025-01-10 14:40:00+00', '166', 'Preventative', '0', '8', 'Planned', 'Spuitneus reinigen', '7'), ('12', '2025-01-10 14:40:00+00', '185', 'Preventative', '0', '8', 'Planned', 'Slijtstrippen vervangen', '7'), ('13', '2025-01-10 14:40:00+00', '217', 'Preventative', '0', '8', 'Planned', 'Inspecteren', '7'), ('14', '2025-01-08 13:00:40.498+00', '271', 'Corrective', '0', '5', 'Planned', 'Koelingskanalen controleren', null), ('15', '2025-01-13 12:40:00+00', '166', 'Preventative', '0', '3', 'Planned', 'Polijsten', null), ('16', '2025-01-08 12:40:00+00', '259', 'Preventative', '0', '6', 'Planned', 'Elektrische aansluitingen inspecteren', null), ('17', '2025-01-11 12:40:00+00', '333', 'Corrective', '0', '7', 'Planned', 'Geleiders reviseren', null), ('18', '2025-01-07 16:00:00+00', '605', 'Corrective', '0', '4', 'Planned', 'Afdichtingen vervangen', null);

  -- Insert demo maintenance milestones for molds
INSERT INTO public.i_mold_maintenance_milestones (mold_id, milestone_shots, maintenance_type, send_sms, created_at, updated_at, sms_sent)
VALUES
  (1, 174, 'Routine Cleaning', false, '2025-01-01 08:30:00', '2025-01-01 08:30:00', false),
  (2, 173, 'Lubrication', true, '2025-01-02 09:45:00', '2025-01-05 14:20:00', false),
  (3, 173, 'Inspection', false, '2025-01-03 12:00:00', '2025-01-03 12:00:00', false),
  (4, 173, 'Repair', true, '2025-01-04 10:10:00', '2025-01-06 16:40:00', false),
  (5, 173, 'Routine Cleaning', false, '2025-01-05 14:50:00', '2025-01-05 14:50:00', false),
  (6, 173, 'Urgent Repair', true, '2025-01-06 15:00:00', '2025-01-06 18:30:00', false);

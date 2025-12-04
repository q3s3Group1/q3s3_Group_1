-- Drop the old trigger that might reference mold_id
DROP TRIGGER IF EXISTS trg_maintenance_plan_notification ON public.i_maintenance_plans CASCADE;

-- Drop the old function if it exists
DROP FUNCTION IF EXISTS create_notification_for_maintenance() CASCADE;

-- Create function to handle maintenance plan notifications
-- This function is called by the trigger when a new maintenance plan is inserted
CREATE OR REPLACE FUNCTION create_notification_for_maintenance()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a notification when a new maintenance plan is created
  INSERT INTO public.i_notifications (
    status,
    message,
    detected_at,
    machine_id
  ) VALUES (
    'maintenance',
    'New maintenance plan created: ' || NEW.maintenance_type,
    NOW(),
    NEW.machine_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for maintenance plan notifications
CREATE TRIGGER trg_maintenance_plan_notification
AFTER INSERT ON public.i_maintenance_plans
FOR EACH ROW
EXECUTE FUNCTION create_notification_for_maintenance();

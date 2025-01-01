CREATE OR REPLACE FUNCTION send_notification_to_edge_function()
RETURNS TRIGGER AS $$
DECLARE
  notification jsonb;
BEGIN
  -- Prepare notification
  SELECT row_to_json(NEW) INTO notification
  FROM public.i_notifications
  WHERE id = NEW.id;

  -- Trigger the Edge function (HTTP POST request)
  PERFORM pg_notify(
    'send_notification', 
    notification::text
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER notification_trigger
AFTER INSERT ON public.i_notifications
FOR EACH ROW
EXECUTE FUNCTION send_notification_to_edge_function();

CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
    'check_offline_machines', -- Job name
    '* * * * *',              -- Cron expression (every minute)
    $$
    INSERT INTO i_notifications (machine_id, message, detected_at, status, send_sms)
    SELECT machine_id, 'Machine offline', NOW(), 'offline', TRUE
    FROM v_machine_status
    WHERE last_update < NOW() - INTERVAL '10 minutes'
      AND NOT EXISTS (
          SELECT 1 FROM i_notifications WHERE machine_id = v_machine_status.machine_id AND read_at IS NULL
      )
    $$
);

ALTER TABLE i_notifications ADD COLUMN resolved_at TIMESTAMP;

SELECT cron.schedule(
    'notify_online_machines',
    '* * * * *',  -- Every minute
    $$
    WITH updated_notifications AS (
        -- Step 1: Resolve offline notifications by setting resolved_at
        UPDATE i_notifications
        SET resolved_at = NOW()
        WHERE machine_id IN (
            SELECT machine_id
            FROM v_machine_status
            WHERE last_update >= NOW() - INTERVAL '10 minutes'
        )
          AND resolved_at IS NULL
          AND message = 'Machine offline'
        RETURNING machine_id, NOW() AS resolved_at
    )
    -- Step 2: Insert a new online notification for resolved machines
    INSERT INTO i_notifications (machine_id, message, detected_at, status, send_sms)
    SELECT machine_id, 'Machine back online', NOW(), 'online', FALSE
    FROM updated_notifications
    $$
);

create extension http with schema extensions;

CREATE OR REPLACE FUNCTION url_encode(input TEXT)
RETURNS TEXT AS $$
DECLARE
  encoded TEXT := '';
  i INT;
  c CHAR;
BEGIN
  FOR i IN 1..LENGTH(input) LOOP
    c := SUBSTRING(input FROM i FOR 1);
    IF c ~ '[a-zA-Z0-9_.~-]' THEN
      encoded := encoded || c;
    ELSE
      encoded := encoded || '%' || TO_HEX(ASCII(c));
    END IF;
  END LOOP;
  RETURN encoded;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_new_notification()
RETURNS TRIGGER AS $$
DECLARE
  query_url TEXT;
  response TEXT;
BEGIN
  -- Construct the query string with URL-encoded parameters
  query_url := 'https://pmxcsnscsngbfrqkxufg.supabase.co/functions/v1/new_notification?' ||
               'id=' || url_encode(NEW.id::text) || '&' ||
               'message=' || url_encode(NEW.message) || '&' ||
               'detected_at=' || url_encode(NEW.detected_at::text) || '&' ||
               'machine_id=' || url_encode(NEW.machine_id::text) || '&' ||
               'status=' || url_encode(NEW.status::text);

  -- Perform the GET request and store the response
  response := http_get(query_url);

  -- Optionally, log or handle the response
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;





CREATE TRIGGER "New Notification"
AFTER INSERT ON i_notifications
FOR EACH ROW
EXECUTE FUNCTION notify_new_notification();

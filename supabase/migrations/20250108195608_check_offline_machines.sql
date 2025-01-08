CREATE EXTENSION IF NOT EXISTS pg_cron;

SELECT cron.schedule(
    'check_offline_machines', -- Job name
    '* * * * *',              -- Cron expression (every minute)
    $$
    INSERT INTO i_notifications (machine_id, message, detected_at, status)
    SELECT machine_id, 'Machine offline', NOW(), 'offline'
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
    INSERT INTO i_notifications (machine_id, message, detected_at, status)
    SELECT machine_id, 'Machine back online', NOW(), 'online'
    FROM updated_notifications
    $$
);


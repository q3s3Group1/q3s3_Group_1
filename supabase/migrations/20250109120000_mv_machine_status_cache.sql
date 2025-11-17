-- Materialized snapshot for machine status to avoid timeouts when querying v_monitoring_data
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_machine_status AS
WITH aggregated_monitoring AS (
    SELECT
        md.board,
        md.port,
        MAX(md."timestamp") AS last_shot_time,
        COUNT(*) AS total_shots,
        AVG(md.shot_time) AS avg_shot_time
    FROM
        v_monitoring_data md
    GROUP BY
        md.board,
        md.port
), reference_clock AS (
    SELECT
        COALESCE(MAX(md."timestamp")::timestamptz, NOW()) AS simulated_now
    FROM
        v_monitoring_data md
), latest_shots AS (
    SELECT
        mp.id AS machine_id,
        mp.name AS machine_name,
        mp.board,
        mp.port,
        am.last_shot_time,
        am.total_shots,
        am.avg_shot_time,
        rc.simulated_now - am.last_shot_time::timestamptz AS time_since_last_shot
    FROM
        machine_monitoring_poorten mp
        LEFT JOIN aggregated_monitoring am ON am.board = mp.board
            AND am.port = mp.port
        CROSS JOIN reference_clock rc
    WHERE
        mp.visible = TRUE
)
SELECT
    ls.machine_id,
    ls.machine_name,
    ls.board,
    ls.port,
    CASE
        WHEN ls.last_shot_time IS NULL THEN 'Stilstand'::text
        WHEN ls.time_since_last_shot <= '24:00:00'::interval THEN 'Actief'::text
    WHEN ls.time_since_last_shot > '24:00:00'::interval THEN 'Inactief'::text
        ELSE 'Stilstand'::text
    END AS status,
    COALESCE(ls.total_shots, 0::bigint) AS total_shots,
    COALESCE(ls.avg_shot_time, 0.0::double precision) AS avg_shot_time,
    ls.last_shot_time AS last_update,
    ls.time_since_last_shot,
    COALESCE(EXTRACT(EPOCH FROM ls.time_since_last_shot), 0)::bigint AS time_since_last_shot_seconds
FROM
    latest_shots ls;

-- Unique index required for concurrent refreshes
CREATE UNIQUE INDEX IF NOT EXISTS mv_machine_status_machine_id_idx
    ON public.mv_machine_status (machine_id);

-- Initial refresh to populate snapshot
REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_machine_status;

-- Re-expose the old view name to consumers via the materialized data
CREATE OR REPLACE VIEW public.v_machine_status AS
SELECT * FROM public.mv_machine_status;

GRANT SELECT ON public.mv_machine_status TO anon;
GRANT SELECT ON public.mv_machine_status TO authenticated;
GRANT SELECT ON public.mv_machine_status TO service_role;

-- Ensure the pg_cron extension is available
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Replace any existing refresh job for this snapshot
DO $$
DECLARE
    job_id INTEGER;
BEGIN
    SELECT jobid INTO job_id FROM cron.job WHERE jobname = 'refresh_mv_machine_status';
    IF job_id IS NOT NULL THEN
        PERFORM cron.unschedule(job_id);
    END IF;
END
$$;

-- Refresh the cache every minute to keep statuses reasonably fresh
SELECT cron.schedule(
    'refresh_mv_machine_status',
    '* * * * *',
    $$REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_machine_status$$
);

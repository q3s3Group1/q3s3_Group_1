CREATE OR REPLACE FUNCTION get_monitoring_intervals(
    start_date TIMESTAMP without time zone,
    end_date TIMESTAMP without time zone,
    interval_input VARCHAR,
    board_input INT,
    port_input INT
)
RETURNS TABLE (
    truncated_timestamp TIMESTAMP,
    total_shots INT,
    average_shot_time DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    WITH intervals AS (
        SELECT generate_series(
            start_date,
            end_date,
            CASE 
                WHEN interval_input = 'minute' THEN INTERVAL '1 minute'
                WHEN interval_input = '5 minute' THEN INTERVAL '5 minutes'
                WHEN interval_input = 'hour' THEN INTERVAL '1 hour'
                WHEN interval_input = 'day' THEN INTERVAL '1 day'
                WHEN interval_input = 'week' THEN INTERVAL '1 week'
                ELSE INTERVAL '1 day'
            END
        )::TIMESTAMP AS truncated_timestamp
    )
    SELECT
        intervals.truncated_timestamp,
        CAST(COUNT(v.id) AS INT) AS total_shots,
        COALESCE(AVG(v.shot_time), 0) AS average_shot_time
    FROM
        intervals
    LEFT JOIN v_monitoring_data v
    ON
        DATE_TRUNC(
            CASE 
                WHEN interval_input = 'minute' THEN 'minute'
                WHEN interval_input = '5 minute' THEN 'minute'
                WHEN interval_input = 'hour' THEN 'hour'
                WHEN interval_input = 'day' THEN 'day'
                WHEN interval_input = 'week' THEN 'week'
            END, v.timestamp AT TIME ZONE 'UTC'
        ) = intervals.truncated_timestamp
        AND (interval_input != '5 minute' OR EXTRACT(MINUTE FROM v.timestamp) % 5 = 0)
        AND v.board = board_input
        AND v.port = port_input
    GROUP BY
        intervals.truncated_timestamp
    ORDER BY
        intervals.truncated_timestamp;
END;
$$ LANGUAGE plpgsql;

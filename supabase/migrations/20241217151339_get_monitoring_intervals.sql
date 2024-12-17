CREATE OR REPLACE FUNCTION get_monitoring_intervals(
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    interval_input TEXT,
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
                WHEN interval_input = '5 minutes' THEN INTERVAL '5 minutes'
                WHEN interval_input = 'hour' THEN INTERVAL '1 hour'
                ELSE INTERVAL '1 day'
            END
        ) AS truncated_timestamp
    )
    SELECT
        intervals.truncated_timestamp,
        COUNT(v.id) AS total_shots,
        COALESCE(AVG(v.shot_time), 0) AS average_shot_time
    FROM
        intervals
    LEFT JOIN v_monitoring_data v
    ON
        CASE 
            WHEN interval_input = 'minute' THEN DATE_TRUNC('minute', v.timestamp)
            WHEN interval_input = '5 minutes' THEN DATE_TRUNC('minute', v.timestamp) -
                INTERVAL '1 minute' * (EXTRACT(MINUTE FROM v.timestamp) % 5)
            WHEN interval_input = 'hour' THEN DATE_TRUNC('hour', v.timestamp)
            ELSE DATE_TRUNC('day', v.timestamp)
        END = intervals.truncated_timestamp
        AND v.board = board_input
        AND v.port = port_input
    GROUP BY
        intervals.truncated_timestamp
    ORDER BY
        intervals.truncated_timestamp;
END;
$$ LANGUAGE plpgsql;

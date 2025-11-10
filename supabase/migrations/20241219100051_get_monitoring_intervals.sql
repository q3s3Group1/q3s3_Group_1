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
            DATE_TRUNC(
                CASE
                    WHEN interval_input IN ('minute', '5 minute') THEN 'minute'
                    WHEN interval_input = 'hour' THEN 'hour'
                    WHEN interval_input = 'day' THEN 'day'
                    WHEN interval_input = 'week' THEN 'week'
                    ELSE 'day'
                END,
                start_date
            ),
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
    ),
    raw_data AS (
        SELECT
            i.truncated_timestamp,
            COUNT(v.id)::INT AS total_shots,
            COALESCE(AVG(v.shot_time), 0) AS average_shot_time
        FROM
            intervals i
        LEFT JOIN v_monitoring_data v
            ON (
                CASE
                    WHEN interval_input = '5 minute' THEN
                        DATE_TRUNC('hour', v.timestamp AT TIME ZONE 'UTC') +
                        INTERVAL '1 minute' * FLOOR(EXTRACT(MINUTE FROM v.timestamp) / 5) * 5
                    ELSE
                        DATE_TRUNC(
                            CASE
                                WHEN interval_input = 'minute' THEN 'minute'
                                WHEN interval_input = 'hour' THEN 'hour'
                                WHEN interval_input = 'day' THEN 'day'
                                WHEN interval_input = 'week' THEN 'week'
                            END,
                            v.timestamp AT TIME ZONE 'UTC'
                        )
                END
            ) = i.truncated_timestamp
            AND v.board = board_input
            AND v.port = port_input
        GROUP BY i.truncated_timestamp
    )
SELECT
    r.truncated_timestamp,
    CASE
        WHEN ma.status <> 'operational'
            AND r.truncated_timestamp >= ma.last_ts
            THEN 0
        ELSE r.total_shots
        END AS total_shots,
    CASE
        WHEN ma.status <> 'operational'
            AND r.truncated_timestamp >= ma.last_ts
            THEN 0
        ELSE r.average_shot_time
        END AS average_shot_time
FROM
    raw_data r
        LEFT JOIN v_machine_activity ma
                  ON ma.board = board_input
                      AND ma.port = port_input
ORDER BY
    r.truncated_timestamp;
END;
$$ LANGUAGE plpgsql;
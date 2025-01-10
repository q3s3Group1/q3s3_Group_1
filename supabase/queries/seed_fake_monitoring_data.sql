DO $$
DECLARE
    input_board INT := 2;   -- Replace with your desired board value
    input_port INT := 32;   -- Replace with your desired port value
    start_timestamp TIMESTAMP := '2025-01-01 09:00:00';
    num_rows INT := 20000;
    previous_id INT;
BEGIN
    -- Ensure the sequence is up-to-date by setting it to the max current id
    PERFORM setval('monitoring_data_202009_id_seq', COALESCE((SELECT MAX(id) FROM monitoring_data_202009), 1));

    -- Retrieve the last inserted ID for the specified board and port
    SELECT COALESCE(MAX(id), 0) INTO previous_id
    FROM monitoring_data_202009
    WHERE board = input_board AND port = input_port;

    -- Loop to insert rows
    FOR i IN 1..num_rows LOOP
        INSERT INTO monitoring_data_202009 (board, port, com, code, code2, timestamp, datum, mac_address, shot_time, previous_shot_id)
        VALUES (
            input_board,
            input_port,
            3, -- com is always 3
            trunc(random() * (9999 - 1000) + 1000), -- Random code between 1000 and 9999
            trunc(random() * (9999 - 1000) + 1000), -- Random code2 between 1000 and 9999
            start_timestamp + (random() * 30 * i || ' seconds')::INTERVAL, -- Random timestamp
            (start_timestamp + (random() * 30 * i || ' seconds')::INTERVAL)::DATE, -- Datum (date part)
            CASE WHEN random() > 0.5 THEN '94C69111A3F3' ELSE 'D8CB8AC67D05' END, -- Random MAC address
            ROUND((random() * (10 - 4) + 4) * 10000) / 10000.0, -- Random shot time between 4 and 10
            previous_id
        );

        -- Update previous_id
        SELECT currval('monitoring_data_202009_id_seq') INTO previous_id;
    END LOOP;
END $$;

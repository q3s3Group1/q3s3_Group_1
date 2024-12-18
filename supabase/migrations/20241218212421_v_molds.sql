CREATE VIEW v_molds AS
SELECT distinct
    mh.mold_id,
    mh.mold_name,
    mh.board,
    mh.port,
    COUNT(DISTINCT mh.production_id) AS usage_periods, -- Aantal unieke gebruiksperiodes
    COALESCE(SUM(mh.real_amount), 0) AS total_shots, -- Totale shots gebaseerd op real_amount
    MIN(mh.start_date || ' ' || mh.start_time)::timestamp AS first_used, -- Eerste gebruiksdatum en tijd
    MAX(mh.end_date || ' ' || mh.end_time)::timestamp AS last_used -- Laatste gebruiksdatum en tijd
FROM
    mv_molds_history mh
GROUP BY
    mh.mold_id, mh.mold_name, mh.board, mh.port; -- Groeperen op mold_id, mold_name, board, en port

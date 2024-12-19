create MATERIALIZED VIEW mv_molds_history AS
SELECT
    pd.id AS production_id,
    pd.treeview_id AS mold_id,
    t.naam AS mold_name,
    pd.board,
    pd.port,
    mmp.id AS machine_id,
    pd.start_date,
    pd.start_time,
    pd.end_date,
    pd.end_time,
    COALESCE(COUNT(md.id), 0) AS real_amount,
    pd.name AS production_name,
    pd.description AS production_description
FROM
    production_data pd
JOIN
    treeview t ON pd.treeview_id = t.id
LEFT JOIN
    v_monitoring_data md ON 
        md.board = pd.board AND
        md.port = pd.port AND
        md.timestamp >= (pd.start_date || ' ' || pd.start_time)::timestamp AND
        md.timestamp <= (pd.end_date || ' ' || pd.end_time)::timestamp
LEFT JOIN
    machine_monitoring_poorten mmp ON pd.board = mmp.board AND pd.port = mmp.port -- Link to machine_monitoring_poorten
GROUP BY
    pd.id, pd.treeview_id, t.naam, pd.board, pd.port, mmp.id, pd.start_date, pd.start_time, pd.end_date, pd.end_time, pd.name, pd.description
ORDER BY
    pd.start_date, pd.start_time;
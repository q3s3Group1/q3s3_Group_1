CREATE OR REPLACE VIEW v_molds AS
SELECT
  mh.mold_id,
  mh.mold_name,
  MAX(CASE
        WHEN CURRENT_DATE BETWEEN mh.start_date AND mh.end_date THEN mh.board
        ELSE NULL
      END) AS board,
  MAX(CASE
        WHEN CURRENT_DATE BETWEEN mh.start_date AND mh.end_date THEN mh.port
        ELSE NULL
      END) AS port,
  COUNT(DISTINCT mh.production_id) AS usage_periods,
  COALESCE(SUM(mh.real_amount), 0::numeric) AS total_shots,
  MIN((mh.start_date || ' '::text) || mh.start_time)::timestamp WITHOUT TIME ZONE AS first_used,
  MAX((mh.end_date || ' '::text) || mh.end_time)::timestamp WITHOUT TIME ZONE AS last_used
FROM
  mv_molds_history mh
GROUP BY
  mh.mold_id, mh.mold_name;

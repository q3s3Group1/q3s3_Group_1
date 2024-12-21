CREATE OR REPLACE VIEW v_notifications AS
SELECT
  i.id,
  i.status,
  i.message,
  i.detected_at,
  i.send_sms,
  i.sms_sent,
  i.read_at,
  i.mold_id,
  i.machine_id,
  mh.board,
  mh.port
FROM
  public.i_notifications i
LEFT JOIN
  mv_molds_history mh
  ON i.mold_id = mh.mold_id
  AND i.detected_at BETWEEN mh.start_date AND COALESCE(mh.end_date, CURRENT_DATE)
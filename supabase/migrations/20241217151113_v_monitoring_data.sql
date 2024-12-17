create view
  public.v_monitoring_data as
select
  monitoring_data_202009.id,
  monitoring_data_202009.board,
  monitoring_data_202009.port,
  monitoring_data_202009.com,
  monitoring_data_202009.code,
  monitoring_data_202009.code2,
  monitoring_data_202009."timestamp",
  monitoring_data_202009.datum,
  monitoring_data_202009.mac_address,
  monitoring_data_202009.shot_time,
  monitoring_data_202009.previous_shot_id
from
  monitoring_data_202009
union all
select
  monitoring_data_202010.id,
  monitoring_data_202010.board,
  monitoring_data_202010.port,
  monitoring_data_202010.com,
  monitoring_data_202010.code,
  monitoring_data_202010.code2,
  monitoring_data_202010."timestamp",
  monitoring_data_202010.datum,
  monitoring_data_202010.mac_address,
  monitoring_data_202010.shot_time,
  monitoring_data_202010.previous_shot_id
from
  monitoring_data_202010;
create view
  public.v_machine_status as
with
  aggregated_monitoring as (
    select
      monitoring_data_202009.board,
      monitoring_data_202009.port,
      max(monitoring_data_202009."timestamp") as last_shot_time,
      count(*) as total_shots,
      avg(monitoring_data_202009.shot_time) as avg_shot_time
    from
      monitoring_data_202009
    group by
      monitoring_data_202009.board,
      monitoring_data_202009.port
  ),
  latest_shots as (
    select
      mp.id as machine_id,
      mp.name as machine_name,
      mp.board,
      mp.port,
      am.last_shot_time,
      am.total_shots,
      am.avg_shot_time,
      now() - am.last_shot_time::timestamp with time zone as time_since_last_shot
    from
      machine_monitoring_poorten mp
      left join aggregated_monitoring am on am.board = mp.board
      and am.port = mp.port
  )
select
  ls.machine_id,
  ls.machine_name,
  ls.board,
  ls.port,
  case
    when ls.last_shot_time is null then 'Stilstand'::text
    when ls.time_since_last_shot <= '01:00:00'::interval then 'Actief'::text
    when ls.time_since_last_shot <= '10:00:00'::interval then 'Inactief'::text
    else 'Stilstand'::text
  end as status,
  coalesce(ls.total_shots, 0::bigint) as total_shots,
  coalesce(ls.avg_shot_time, 0.0::double precision) as avg_shot_time,
  ls.last_shot_time as last_update
from
  latest_shots ls;
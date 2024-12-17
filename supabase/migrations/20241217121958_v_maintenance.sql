create view
  public.v_maintenance as
select distinct
  ma.id,
  ma.planned_date,
  ma.mold_id,
  ma.maintenance_type,
  ma.description,
  ma.assigned_to,
  ma.status,
  ma.maintenance_action,
  ma.group_id,
  me.name as mechanic_name,
  me.id as mechanic_id,
  me.specialization as mechanic_specialization,
  am.name as mold_name,
  am.description as mold_description
from
  i_maintenance_plans ma
  left join i_mechanics me on me.id = ma.assigned_to
  left join v_all_molds am on am.id = ma.mold_id;
create view
  public.v_maintenance as
SELECT DISTINCT
  ma.id,
  ma.planned_date,
  ma.mold_id,
  ma.maintenance_type,
  ma.description AS maintenance_description,
  ma.assigned_to,
  ma.status,
  ma.maintenance_action,
  ma.group_id,
  me.name AS mechanic_name,
  me.id AS mechanic_id,
  me.specialization AS mechanic_specialization,
  vm.mold_name
FROM
  i_maintenance_plans ma
LEFT JOIN i_mechanics me ON me.id = ma.assigned_to
LEFT JOIN v_molds vm ON vm.mold_id = ma.mold_id;
;
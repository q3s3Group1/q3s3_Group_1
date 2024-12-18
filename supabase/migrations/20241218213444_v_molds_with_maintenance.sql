CREATE VIEW v_molds_with_maintenance AS

SELECT
    vm.mold_id,
    vm.mold_name,
    vm.board,
    vm.port,
    vm.usage_periods,
    vm.total_shots,
    vm.first_used,
    vm.last_used,
    mm.milestone_shots,
    CASE
        WHEN vm.total_shots >= mm.milestone_shots THEN 'Maintenance Required'
        ELSE 'OK'
    END AS maintenance_status -- Status of onderhoud
FROM
    v_molds vm
LEFT JOIN
    mold_maintenance_milestones mm ON vm.mold_id = mm.mold_id
ORDER BY
    vm.mold_id, mm.milestone_shots;

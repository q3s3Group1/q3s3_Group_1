import { MaintenanceFull } from "@/types/supabase";
import { supabase } from "./client";

type MaintenanceRow = Omit<MaintenanceFull, "planned_date" | "description"> & {
    planned_date: string | Date;
    description?: string;
    maintenance_description?: string;
};

const mapToMaintenanceFull = (rows: MaintenanceRow[] | null): MaintenanceFull[] =>
    (rows ?? []).map((row) => ({
        ...row,
        description: row.description ?? row.maintenance_description ?? "",
        planned_date: new Date(row.planned_date),
    }));

export async function fetchAllMaintenance(from: Date | null = null, to: Date | null = null, mechanic: number | null = null): Promise<MaintenanceFull[]> {
    const safeFrom = from ?? new Date(0);
    // Use a far-future but safe timestamp when `to` is not provided so we include future dates
    // Avoid extremely large JS timestamps (they produce years like +275760 which Postgres rejects).
    // Use year 3000 which is safely in range for both JS Date and Postgres timestamps.
    const safeTo = to ?? new Date('3000-01-01T00:00:00.000Z');


    const {data, error} = mechanic == null ?
                await supabase
                    .from('v_maintenance')
                    .select('*')
                    .lt("planned_date", safeTo.toISOString())
                    .gt("planned_date", safeFrom.toISOString()) :
                await supabase
                    .from('v_maintenance')
                    .select('*')
                    .lt("planned_date", safeTo.toISOString())
                    .gt("planned_date", safeFrom.toISOString())
                    .eq("assigned_to", mechanic);

    if (error) {
        throw new Error(`Error fetching maintenance: ${error.message}`);
    }

    // debug: log raw rows coming from the DB to help diagnose empty results
    // (remove this log once the issue is resolved)
    // eslint-disable-next-line no-console
    console.debug('[fetchAllMaintenance] raw rows:', data);

    return mapToMaintenanceFull(data);
}

export async function fetchMaintenance(id: number): Promise<MaintenanceFull> {
    const {data, error} = await supabase
        .from('v_maintenance')
        .select('*').eq("id", id).single()

    if (error) {
        throw new Error(`Error fetching maintenance: ${error.message}`);
    }

    const [mapped] = mapToMaintenanceFull([data]);
    return mapped;
}

// get by machine_id
export async function fetchMaintenanceByMachineId(machine_id: number): Promise<MaintenanceFull[]> {
    const {data, error} = await supabase
        .from('v_maintenance')
        .select('*').eq("machine_id", machine_id)

    if (error) {
        throw new Error(`Error fetching maintenance: ${error.message}`);
    }

    return mapToMaintenanceFull(data);
}
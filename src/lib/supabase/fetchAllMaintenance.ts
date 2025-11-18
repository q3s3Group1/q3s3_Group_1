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
    const safeTo = to ?? new Date(999999999999);


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

// get by mold_id
export async function fetchMaintenanceByMoldId(mold_id: number): Promise<MaintenanceFull[]> {
    const {data, error} = await supabase
        .from('v_maintenance')
        .select('*').eq("mold_id", mold_id)

    if (error) {
        throw new Error(`Error fetching maintenance: ${error.message}`);
    }

    return mapToMaintenanceFull(data);
}
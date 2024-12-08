import {MaintenanceFull} from "@/types/supabase";
import {supabase} from "./client";

export async function fetchAllMaintenance(from: Date | null = null, to: Date | null = null): Promise<MaintenanceFull[]> {
    from = from == null ? new Date(0) : from
    to = to == null ? new Date(999999999999) : to

    const {data, error} = await supabase
        .from('v_maintenance')
        .select('*').lt("planned_date", to.toISOString()).gt("planned_date", from.toISOString())

    if (error) {
        throw new Error(`Error fetching maintenance: ${error.message}`);
    }

    data.forEach((m) => m.planned_date = new Date(m.planned_date))

    return data || []
}

export async function fetchMaintenance(id: number): Promise<MaintenanceFull> {
    const {data, error} = await supabase
        .from('v_maintenance')
        .select('*').eq("id", id).single()

    if (error) {
        throw new Error(`Error fetching maintenance: ${error.message}`);
    }

    data.planned_for = new Date(data.planned_for)

    return data
}
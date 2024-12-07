import { MaintenanceFull } from "@/types/supabase";
import { supabase } from "./client";

export async function fetchMaintenance(from: Date | null = null, to: Date | null = null): Promise<MaintenanceFull[]> {
    from = from == null ? new Date(0) : from
    to = to == null ? new Date(999999999999) : to

    const {data, error} = await supabase
        .from('v_maintenance')
        .select('*').lt("planned_date", to.toISOString()).gt("planned_date", from.toISOString())

    if (error) {
        throw new Error(`Error fetching mechanics: ${error.message}`);
    }

    return data || []
}
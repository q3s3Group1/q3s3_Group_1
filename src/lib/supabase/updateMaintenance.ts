import {Maintenance} from "@/types/supabase";
import {supabase} from "./client";


export async function updateMaintenance(maintenance: Omit<Maintenance, "status">) {
    const {error} = await supabase
        .from('i_maintenance_plans')
        .update(maintenance).eq('id', maintenance.id)

    if (error) {
        throw new Error(`Error updating maintenance: ${error.message}`);
    }

    return;
}
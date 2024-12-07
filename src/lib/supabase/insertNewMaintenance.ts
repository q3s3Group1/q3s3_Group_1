import { Maintenance } from "@/types/supabase";
import { supabase } from "./client";


export async function insertNewMaintenance(maintenance: Omit<Maintenance, "id" | "status">) {

    

    const {error} = await supabase
        .from('i_maintenance_plans')
        .insert(maintenance)

    if (error) {
        throw new Error(`Error inserting maintenance: ${error.message}`);
    }

    return;
}
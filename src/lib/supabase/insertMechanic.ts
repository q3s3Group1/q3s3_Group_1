import {Mechanic} from "@/types/supabase";
import {supabase} from "./client";

export async function insertMechanic(mechanic: Omit<Mechanic, "id">) {
    const {data, error} = await supabase
        .from('i_mechanics')
        .insert(mechanic);

    if (error) {
        throw new Error(`Error inserting mechanic: ${error.message}`);
    }

    return data || []
}
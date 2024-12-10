import {Mechanic} from "@/types/supabase";
import {supabase} from "./client";

export async function updateMechanic(mechanic: Mechanic) {
    const {data, error} = await supabase
        .from('i_mechanics')
        .update({name: mechanic.name, specialization: mechanic.specialization}).eq("id", mechanic.id)

    if (error) {
        throw new Error(`Error updating mechanic: ${error.message}`);
    }

    return data || []
}
import {Mechanic} from "@/types/supabase";
import {supabase} from "./client";

export async function fetchMechanic(id: number): Promise<Mechanic> {
    const {data, error} = await supabase
        .from('i_mechanics')
        .select('*').eq("id", id).single()

    if (error) {
        throw new Error(`Error fetching mechanic: ${error.message}`);
    }

    return data
}
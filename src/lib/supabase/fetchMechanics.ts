import {Mechanic} from "@/types/supabase";
import {supabase} from "./client";

export async function fetchMechanics(): Promise<Mechanic[]> {
    const {data, error} = await supabase
        .from('i_mechanics')
        .select('*')

    if (error) {
        throw new Error(`Error fetching mechanics: ${error.message}`);
    }

    return data || []
}
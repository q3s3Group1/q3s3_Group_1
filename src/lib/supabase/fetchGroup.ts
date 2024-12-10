import {supabase} from "@/lib/supabase/client";
import {Group} from "@/types/supabase";

export async function fetchGroup(groupId: number): Promise<Group>{
    const {data, error} = await supabase.from("i_maintenance_groups").select("*").eq("id", groupId).single()

    if (error){
        throw error
    }

    return data
}
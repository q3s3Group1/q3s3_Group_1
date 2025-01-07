import {Maintenance} from "@/types/supabase";
import {supabase} from "@/lib/supabase/client";

export async function insertNewMoldMaintenanceMilestone(moldId: number, milestone: number) {
    const newMilestone = {
        mold_id: moldId,
        milestone_shots: milestone,
        maintenance_type: "Preventative",
        send_sms: true
    }

    const {error} = await supabase
        .from('i_mold_maintenance_milestones')
        .insert(newMilestone)

    if (error) {
        throw new Error(`Error inserting milestone: ${error.message}`);
    }

    return;
}
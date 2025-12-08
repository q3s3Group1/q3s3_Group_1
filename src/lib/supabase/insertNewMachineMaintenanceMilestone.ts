import {supabase} from "@/lib/supabase/client";

export async function insertNewMachineMaintenanceMilestone(machineId: number, milestone: number) {
    const newMilestone = {
        machine_id: machineId,
        milestone_shots: milestone,
        maintenance_type: "Preventative",
        send_sms: true
    }

    const {error} = await supabase
        .from('i_machine_maintenance_milestones')
        .insert(newMilestone)

    if (error) {
        throw new Error(`Error inserting milestone: ${error.message}`);
    }

    return;
}
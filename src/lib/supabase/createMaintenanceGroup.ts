import {supabase} from "@/lib/supabase/client";
import {MaintenanceFull} from "@/types/supabase";
import {fetchMaintenance} from "@/lib/supabase/fetchAllMaintenance";
import {updateMaintenanceDate} from "@/lib/supabase/updateMaintenanceDate";

async function createGroup() {
    const {data, error} = await supabase.from("i_maintenance_groups").insert({}).select().single();

    if (error) {
        throw error;
    }

    return data
}

async function setGroup(maintenanceId: number, groupId: number | null) {
    const {
        data,
        error
    } = await supabase.from("i_maintenance_plans").update({group_id: groupId}).eq("id", maintenanceId);

    if (error) {
        throw error;
    }
    return
}

export async function addMaintenanceToGroup(maintenancePlanBeingAdded: number, maintenancePlanGettingAddedTo: number) {
    const adding: MaintenanceFull = await fetchMaintenance(maintenancePlanBeingAdded);
    const beingAddedTo: MaintenanceFull = await fetchMaintenance(maintenancePlanGettingAddedTo)

    if (beingAddedTo.group_id == null) {
        const newGroup = await createGroup()
        await setGroup(beingAddedTo.id, newGroup.id)
        await setGroup(adding.id, newGroup.id)
    } else {
        await setGroup(adding.id, beingAddedTo.group_id)
    }

    await updateMaintenanceDate(adding.id, beingAddedTo.planned_date)
}

export async function removeMaintenanceGroup(maintenancePlanId: number) {
    await setGroup(maintenancePlanId, null)
}
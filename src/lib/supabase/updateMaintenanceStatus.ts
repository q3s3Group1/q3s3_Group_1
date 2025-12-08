import { MaintenanceMachine } from "@/types/supabase";
import { supabase } from "./client";

export async function updateMaintenanceStatus(
  maintenanceId: number,
  status: MaintenanceMachine["status"]
) {
  const { error } = await supabase
    .from("i_maintenance_plans")
    .update({ status })
    .eq("id", maintenanceId);

  if (error) {
    throw new Error(`Error updating maintenance status: ${error.message}`);
  }
}

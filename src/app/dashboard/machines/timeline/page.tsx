export const dynamic = 'force-dynamic';

import { fetchMachines } from "@/lib/supabase/fetchMachines";
import { Machine, MachineTimeline } from "@/types/supabase";
import Rows from "./rows";


export interface MachineWithData extends Machine {
  data?: MachineTimeline[];
}

export default async function Page() {
  const machines = await fetchMachines();

 

  return (
    <div className="">

     <div>
     <Rows machines={machines} />
     </div>
    </div>
  )
}
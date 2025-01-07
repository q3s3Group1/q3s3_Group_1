export const dynamic = 'force-dynamic';

import TimelineLegend from "@/components/timeline/TimelineLegend";
import TimelineRow from "@/components/timeline/TimelineRow";
import { fetchMachines } from "@/lib/supabase/fetchMachines";
import { Machine, MachineTimeline } from "@/types/supabase";
import Header from "../../header";
import Rows from "./rows";

// extend machine type with timeline
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
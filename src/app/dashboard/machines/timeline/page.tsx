import TimelineLegend from "@/components/timeline/TimelineLegend";
import TimelineRow from "@/components/timeline/TimelineRow";
import { fetchMachines } from "@/lib/supabase/fetchMachines";
import { Machine, MachineTimeline } from "@/types/supabase";

// extend machine type with timeline
export interface MachineWithData extends Machine {
  data?: MachineTimeline[];
}


export default async function Page() {
  const machines = await fetchMachines();

 

  return (
    <div className="flex flex-col gap-1 ">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
      <TimelineLegend />
      </div>

     <div className="flex-1 overflow-auto px-4">
     {machines.map((machine) => (
        <TimelineRow 
          key={machine.machine_id} 
          machine={machine} 
          targetEfficiency={0} 
        />
      ))}
     </div>
    </div>
  )
}
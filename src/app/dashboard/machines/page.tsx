
import { fetchMachines } from "@/lib/supabase/fetchMachines";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import StatusIndicator from "@/components/timeline/StatusIndicator";
import Link from "next/link";

export default async function Page() {
    
    const machines = await fetchMachines();

    
    
    return (
       <div>
         <Table>
      <TableCaption>
        Machines
      </TableCaption>
      <TableHeader className="sticky top-0 z-10">
        <TableRow>
          <TableHead>Status</TableHead>

          <TableHead className="w-[100px]">
            Machine
          </TableHead>

          <TableHead className="text-right w-44">
            Avg. Shot Time
          </TableHead>
          {/* total shots */}
          <TableHead>
            Total Shots
            </TableHead>

          <TableHead>
            Last Update
          </TableHead>
          
        </TableRow>
      </TableHeader>
      <TableBody>
        {machines.map((machine) => (
           <TableRow key={machine.machine_id}>
            <TableCell className="flex items-center justify-center gap-1">
                <StatusIndicator status={machine.status} />
                {machine.status}</TableCell>
            <TableCell className="font-medium">
         <Link key={machine.machine_id} href={`/dashboard/machines/${machine.machine_id}`} className="text-blue-500 underline">
              
              {machine.machine_name
                || `Machine ${machine.machine_id}`
                }
          </Link>
                
                </TableCell>

            <TableCell className="text-right">{machine.avg_shot_time.toFixed(2)}</TableCell>
            <TableCell>{machine.total_shots}</TableCell>
                    {/* How long ago? */}
            <TableCell>{
                machine.last_update ? new Date(machine.last_update).toLocaleString("nl-NL")
                 : 'N/A'
                }</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
            <TableCell colSpan={4}>
                Total: {machines.length} machines
            </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
       </div>
    );
    }



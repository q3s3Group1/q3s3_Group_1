import { fetchMachines } from "@/lib/supabase/fetchMachines";
import {
  Table, TableBody, TableCaption, TableCell,
  TableFooter, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import StatusIndicator from "@/components/timeline/StatusIndicator";
import Link from "next/link";
import Header from "../header";
import type { Machine } from "@/types/supabase";

export default async function Page() {
  const machines: Machine[] = await fetchMachines();

  return (
    <>
      <Header title="Machines" description="Dit zijn alle machines" />
      <div>
        <Table>
          <TableCaption>Machines</TableCaption>
          <TableHeader className="sticky top-0 z-10">
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead className="w-[160px]">Machine</TableHead>
              <TableHead>Last Shot</TableHead>
              <TableHead className="text-right w-36">Time Since Last Shot</TableHead>
              <TableHead className="text-right w-28">Total Shots</TableHead>
              <TableHead className="text-right w-40">Avg. Shot Time (s)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {machines.map((m) => (
              <TableRow key={m.machine_id}>
                <TableCell className="flex items-center justify-start gap-2">
                  <StatusIndicator status={m.status} />
                  {m.status}
                </TableCell>
                <TableCell className="font-medium">
                  <Link href={`/dashboard/machines/${m.machine_id}`} className="text-blue-500 underline">
                    {m.machine_name || `Machine ${m.machine_id}`}
                  </Link>
                </TableCell>
                <TableCell>{m.last_ts ? new Date(m.last_ts).toLocaleString() : 'N/A'}</TableCell>
                <TableCell className="text-right">{m.time_since_last_shot ?? 'N/A'}</TableCell>
                <TableCell className="text-right">{m.total_shots?.toLocaleString?.() ?? 0}</TableCell>
                <TableCell className="text-right">
                  {typeof (m as any).avg_shot_time === 'number'
                    ? (m as any).avg_shot_time.toFixed(2)
                    : '0.00'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>Total: {machines.length} machines</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}

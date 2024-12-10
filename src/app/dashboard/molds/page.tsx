
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { fetchMolds } from "@/lib/supabase/fetchMolds";
import Link from "next/link";
import Header from "../header";
import { Mold } from "@/types/supabase";
import { Progress } from "@/components/ui/progress";

export default async function Page() {
    
    const molds = await fetchMolds();

    const maintenance_interval = 100000;
    // calculate levels duur
    const calculateLevensduurLeft = (mold: Mold) => {
        
      // return a number between 0 and 100
      // if low shots, return 0
      // eg mold.total_shots_since_maintenance = 100k
      // mold.maintenance_interval = 100k
      // return 0

      // if high shots, return 100

      const shots = mold.total_shots_since_last_maintenance || 0;
      const interval = maintenance_interval;


      const percentage = (shots / interval) * 100;

      // reversed
      const percentageLeft = 100 - percentage;
      

      return percentageLeft;
    }

    
    
    return (
      <>
      <Header
      title={"Actieve Matrijzen"}
      description="Dit zijn de matrijzen die op dit moment in gebruik zijn"
      />
       <div >
         <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Machine</TableHead>

          <TableHead className="w-[100px]">
            Beschrijving
          </TableHead>

          <TableHead className="text-right">
            Naam
          </TableHead>
          {/* total shots */}
          <TableHead>
            Board - Port
            </TableHead>

          {/* Levensduur */}
          <TableHead>
            Levensduur
            </TableHead>

          
        </TableRow>
      </TableHeader>
      <TableBody>
        {molds.map((mold) => (
          <TableRow key={mold.id}>
            <TableCell className="flex items-center gap-1">
                {/* <StatusIndicator status={} /> */}
                <Link key={mold.id} href={`/dashboard/machines/${mold.current_machine_id}`} className="text-blue-500 underline">
                {mold.current_machine_name || "N/A"}
                </Link>
                </TableCell>
            <TableCell className="font-medium">
              <Link key={mold.id} href={`/dashboard/molds/${mold.id}`} className="text-blue-500 underline">
              {mold.description
                || `Mold ${mold.id}`
                }
                </Link>
              </TableCell>

            <TableCell className="text-right">{mold.name}</TableCell>
            <TableCell>{
                mold.board}-{mold.port}</TableCell>


            <TableCell>
              <Progress value={calculateLevensduurLeft(mold)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
            <TableCell colSpan={5}>
                Total: {molds.length} molds
            </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
       </div>
       </>
    );
    }



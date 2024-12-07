
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
import { fetchAllMolds } from "@/lib/supabase/fetchMolds";

export default async function Page() {
    
    const molds = await fetchAllMolds();

    
    
    return (
       <div >
         <Table>
      <TableCaption>
        Dit zijn dus alleen de matrijzen die in gebruik zijn op dit moment
      </TableCaption>
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

          
        </TableRow>
      </TableHeader>
      <TableBody>
        {molds.map((mold) => (
          <TableRow key={mold.id}>
            <TableCell className="flex items-center gap-1">
                {/* <StatusIndicator status={} /> */}
                {mold.current_machine_name || "N/A"}
                </TableCell>
            <TableCell className="font-medium">{mold.description
                || `Mold ${mold.id}`
                }</TableCell>

            <TableCell className="text-right">{mold.name}</TableCell>
            <TableCell>{
                mold.board}-{mold.port}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
            <TableCell colSpan={4}>
                Total: {molds.length} molds
            </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
       </div>
    );
    }



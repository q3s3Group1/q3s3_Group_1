import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

import { MoldHistory } from "@/types/supabase";
import Link from "next/link";
import { DateRange } from "react-day-picker";

// Props
interface MoldHistoryProps {
    moldsHistory: MoldHistory[];

    setRange?: (range: DateRange) => void;

    showMold?: boolean;
    showMachine?: boolean;
    setBoardPort?: (boardPort: { board: number, port: number }) => void;
}

export const MoldHistoryTable = ({ moldsHistory
    , setRange, showMold, showMachine, setBoardPort
 }: MoldHistoryProps) => {
    return (
      <Table>
        <TableCaption>Matrijs Historie</TableCaption>
        <TableHeader>
          <TableRow>
            {showMold && <TableHead>Matrijs</TableHead>}
            {showMachine && <TableHead>Machine</TableHead>}
            <TableHead>Start</TableHead>
            <TableHead>Eind</TableHead>

            <TableHead>Shots</TableHead>

            {/* Bekijk data */}
            {setRange && <TableHead>Bekijk data</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {moldsHistory.map((moldHistory) => (
            <TableRow key={moldHistory.mold_id}>
              {showMold && (
                <TableCell>
                  <Link
                    className="text-blue-500 hover:underline"
                    href={`/dashboard/molds/${moldHistory.mold_id}`}
                    passHref
                  >
                    {moldHistory.mold_name || moldHistory.mold_id}
                  </Link>
                </TableCell>
              )}
              {showMachine && (
                <TableCell>
                  <Link
                    href={`/dashboard/machines/${moldHistory.machine_id}`}
                    passHref
                    className="text-blue-500 hover:underline"
                  >
                    {moldHistory.board} - {moldHistory.port},{" "}
                    {moldHistory.machine_id}
                  </Link>
                </TableCell>
              )}

              <TableCell>{moldHistory.start_date}</TableCell>
              <TableCell>{moldHistory.end_date}</TableCell>

              <TableCell>{moldHistory.real_amount}</TableCell>

              {setRange && (
                <TableCell>
                  <Button
                    onClick={() => {
                      setRange({
                        from: new Date(moldHistory.start_date),
                        to: new Date(moldHistory.end_date),
                      });

                      setBoardPort &&
                        setBoardPort({
                          board: moldHistory.board,
                          port: moldHistory.port,
                        });
                    }}
                  >
                    Bekijk
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
}
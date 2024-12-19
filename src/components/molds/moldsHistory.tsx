import { Button } from "@/components/ui/button";
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

import { MoldHistory } from "@/types/supabase";
import { DateRange } from "react-day-picker";

// Props
interface MoldHistoryProps {
    moldsHistory: MoldHistory[];

    setRange?: (range: DateRange) => void;
}

export const MoldHistoryTable = ({ moldsHistory
    , setRange
 }: MoldHistoryProps) => {
    return (
        <Table>
            <TableCaption>Matrijs Historie</TableCaption>
            <TableHeader>
                <TableRow>
                    {/* Matrijs */}
                    <TableHead>Matrijs</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>Eind</TableHead>

                    <TableHead>Shots</TableHead>

                    {/* Bekijk data */}
                    {
                        setRange && (
                            <TableHead>
                                Bekijk data
                            </TableHead>
                        )
                    }
                </TableRow>
            </TableHeader>
            <TableBody>
                {moldsHistory.map((moldHistory) => (
                    <TableRow key={moldHistory.mold_id}>
                        <TableCell>{moldHistory.mold_name  || moldHistory.mold_id}</TableCell>
                            

                        <TableCell>{moldHistory.start_date}</TableCell>
                        <TableCell>{moldHistory.end_date}</TableCell>

                        <TableCell>{moldHistory.real_amount}</TableCell>

                        {
                            setRange && (
                                <TableCell>
                                    <Button
                                        onClick={() => {
                                            setRange({
                                                from: new Date(moldHistory.start_date),
                                                to: new Date(moldHistory.end_date),
                                            });
                                        }}
                                    >
                                        Bekijk
                                    </Button>
                                </TableCell>
                            )
                        }
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
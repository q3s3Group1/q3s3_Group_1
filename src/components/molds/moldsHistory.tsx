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

    showMold?: boolean;
    showMachine?: boolean;
}

export const MoldHistoryTable = ({ moldsHistory
    , setRange, showMold, showMachine
 }: MoldHistoryProps) => {
    return (
        <Table>
            <TableCaption>Matrijs Historie</TableCaption>
            <TableHeader>
                <TableRow>
                    {
                        showMold && (
                            <TableHead>
                                Matrijs
                            </TableHead>
                        )
                    }
                    {
                        showMachine && (
                            <TableHead>
                                Machine
                            </TableHead>
                        )
                    }
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
                        {
                            showMold && (
                                <TableCell>{moldHistory.mold_name || moldHistory.mold_id}</TableCell>
                            )
                        }
                        {
                            showMachine && (
                                <TableCell>{moldHistory.board} - {moldHistory.port}</TableCell>
                            )
                        }                            

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
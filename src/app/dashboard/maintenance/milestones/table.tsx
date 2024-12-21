import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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

import { Milestone, MoldHistory, MoldMaintenance } from "@/types/supabase";
import Link from "next/link";
import { DateRange } from "react-day-picker";
import { MilestoneStatus } from "./status";
import { CheckIcon, XIcon } from "lucide-react";

// Props
interface MilestoneProps {
    milestones: Milestone[];
    molds: MoldMaintenance[];
}

export const MilestoneTable = ({ 
    milestones,
    molds
 }: MilestoneProps) => {
    return (
        <Table>
            <TableCaption>
                Welke type onderhoud bij hoeveel shots
            </TableCaption>
            <TableHeader>
                <TableRow>

                <TableHead>
                        Matrijs actief
                    </TableHead>

                    <TableHead>Matrijs</TableHead>
                    
                    <TableHead>Type</TableHead>

                    <TableHead>
                        SMS versturen
                    </TableHead>
                    
                    <TableHead>
                       Bij shots / totaal shots
                    </TableHead>


                   
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    milestones.map((milestone, index) => {
                        const mold = molds.find(mold => mold.mold_id === milestone.mold_id);

                        if (!mold) {
                            return null;
                        }

                        // progress
                        const progress = (milestone.milestone_shots / mold.total_shots) * 100;

                        return (
                            <TableRow key={index}>
                                <TableCell className="flex items-center space-x-2">
                                    {mold.board ? (
                                        <><CheckIcon size={24} color="green" /> Ja</>
                                    ) : (
                                        <>
                                        <XIcon size={24} color="red" /> Nee </>
                                    )
                                    }
                                </TableCell>

                                <TableCell>
                                    <Link href={`/dashboard/molds/${milestone.mold_id}`} className="text-blue-500">
                                        {milestone.mold_id}
                                
                                    </Link> 
                                </TableCell>
                                
                                <TableCell>
                                    {milestone.maintenance_type}

                                    
                                </TableCell>

                                <TableCell>
                                    {milestone.send_sms ? "Ja" : "Nee"}
                                </TableCell>

                                <TableCell>
                                    <MilestoneStatus milestone={milestone} mold={mold} />
                                </TableCell>


                                
                                
                                
                                
                            </TableRow>
                        )
                    })
                }
            </TableBody>
        </Table>
    );
}
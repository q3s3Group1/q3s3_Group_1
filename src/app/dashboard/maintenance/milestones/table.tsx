import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

import { Milestone, MachineMaintenance } from "@/types/supabase";
import Link from "next/link";
import { MilestoneStatus } from "./status";
import { CheckIcon, XIcon } from "lucide-react";

// Props
interface MilestoneProps {
    milestones: Milestone[];
    molds: MachineMaintenance[];
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
                       Milestone / Total shots
                    </TableHead>



                   
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    milestones.map((milestone) => {
                        const mold = molds.find(mold => mold.mold_id === milestone.mold_id);

                        if (!mold) {
                            return null;
                        }

                        return (
                            <TableRow key={milestone.id}>
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
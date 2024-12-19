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

import { Milestone, MoldHistory } from "@/types/supabase";
import Link from "next/link";
import { DateRange } from "react-day-picker";

// Props
interface MilestoneProps {
    milestones: Milestone[];
}

export const MilestoneTable = ({ 
    milestones
 }: MilestoneProps) => {
    return (
        <Table>
            <TableCaption>
                Welke type onderhoud bij hoeveel shots
            </TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Mold</TableHead>
                    
                    <TableHead>Type</TableHead>
                    
                    <TableHead>
                        Bij shots   
                    </TableHead>

                   
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    milestones.map((milestone, index) => {
                        return (
                            <TableRow key={index}>
                                <TableCell>
                                    <Link href={`/dashboard/molds/${milestone.mold_id}`} className="text-blue-500">
                                        {milestone.mold_id}
                                    </Link> 
                                </TableCell>
                                
                                <TableCell>
                                    {milestone.maintenance_type}

                                    
                                </TableCell>
                                <TableCell>
                                    {milestone.milestone_shots}
                                </TableCell>
                                

                                
                                
                            </TableRow>
                        )
                    })
                }
            </TableBody>
        </Table>
    );
}
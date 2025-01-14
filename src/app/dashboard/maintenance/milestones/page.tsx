export const dynamic = 'force-dynamic';

import { fetchMolds } from "@/lib/supabase/fetchMolds";
import Header from "../../header";
import { MilestoneTable } from "./table";
import { fetchMilestones } from "@/lib/supabase/milestones";
import { Button } from "@/components/ui/button";
import MilestoneSheet from "./sheet";

// Get all molds

export default async function Page() {

    const molds = await fetchMolds();

    const milestones = await fetchMilestones();

    
    return (
        <div>
           <Header
              title={"Preventieve onderhoudsplanning"} 
                description={"Alle preventieve onderhoudsplanningen voor matrijzen"}
            />

            {/* All molds and its milestones, and a way to add a new one */}
            <div className="flex flex-col">
                <MilestoneTable
                    milestones={milestones}
                    molds={molds}
                    />
            </div>
        </div>
    )
}
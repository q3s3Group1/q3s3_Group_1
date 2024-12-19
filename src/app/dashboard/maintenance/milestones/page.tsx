import { fetchMolds } from "@/lib/supabase/fetchMolds";
import Header from "../../header";
import { MilestoneTable } from "./table";
import { fetchMilestones } from "@/lib/supabase/milestones";

// Get all molds

export default async function Page() {

    const molds = await fetchMolds();

    const milestones = await fetchMilestones();
    
    return (
        <div>
           <Header
              title={"Milestones"}   
                description={"Plan hier bij welke total shot milestones onderhoud nodig is."}
              />

            {/* All molds and its milestones, and a way to add a new one */}
            <div className="flex flex-col">
                <MilestoneTable
                    milestones={milestones}
                    />
            </div>
        </div>
    )
}
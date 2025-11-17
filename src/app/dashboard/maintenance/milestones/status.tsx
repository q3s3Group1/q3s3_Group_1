import { Progress } from "@/components/ui/progress";
import { Milestone, MoldMaintenance } from "@/types/supabase";
import { CheckIcon, XIcon } from "lucide-react";

interface MilestoneStatusProps {
    milestone: Milestone;
    mold: MoldMaintenance;
}

export const MilestoneStatus = ({ milestone, mold }: MilestoneStatusProps) => {
    const targetShots = milestone.milestone_shots > 0 ? milestone.milestone_shots : null;
    const progress = targetShots
        ? Math.min(100, (mold.total_shots / targetShots) * 100)
        : 0;
    const isCompleted = targetShots ? mold.total_shots >= targetShots : false;
    const label = targetShots
        ? `${mold.total_shots} / ${targetShots}`
        : `${mold.total_shots} shots`;

    return (
        <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
                {
                    isCompleted ? (
                        <CheckIcon size={24} color="green" />
                    ) : (
                        <XIcon size={24} color="red" />
                    )
                }
                <span>{label}</span>
            </div>

            <Progress value={progress} />
        </div>
    )
}


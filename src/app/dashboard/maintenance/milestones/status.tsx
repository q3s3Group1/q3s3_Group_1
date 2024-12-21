import { Progress } from "@/components/ui/progress";
import { Milestone, MoldMaintenance } from "@/types/supabase";
import { CheckIcon, XIcon } from "lucide-react";

interface MilestoneStatusProps {
    milestone: Milestone;
    mold: MoldMaintenance;
}

export const MilestoneStatus = ({ milestone, mold }: MilestoneStatusProps) => {
    // progress
    const progress = (mold.total_shots / milestone.milestone_shots) * 100;

    return (
        <div className="flex flex-col items-start space-y-2">
            <div className="flex items-center space-x-2">
                {
                    progress >= 100 ? (
                        <CheckIcon size={24} color="green" />
                    ) : (
                        <XIcon size={24} color="red" />
                    )
                }
                <span>{milestone.milestone_shots} / {mold.total_shots}</span>
            </div>
            <Progress value={progress} />
        </div>
    )
}


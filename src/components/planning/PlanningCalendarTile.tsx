import { MaintenanceFull } from "@/types/supabase"

interface Props {
    maintenancePlan: MaintenanceFull;
}

export default function PlanningCalendarTile(props: Props) {
    return (
        <div
            className="block rounded border p-2 shadow-lg shadow-black/5 text-left transition-all hover:opacity-70 hover:shadow-xl"
            key={props.maintenancePlan.id}>
            <div className="flex">
    <span
        className="block text-sm uppercase font-bold mr-auto">{props.maintenancePlan.mold_description}</span>
                <span
                    className="block text-xs">{new Intl.DateTimeFormat('nl', {timeStyle: 'short'}).format(new Date(props.maintenancePlan.planned_date))}</span>
            </div>

            <span className="block text-xs">{props.maintenancePlan.maintenance_action}</span>
        </div>
    )
}
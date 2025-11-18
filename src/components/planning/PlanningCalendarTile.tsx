"use client"

import {MaintenanceFull} from "@/types/supabase"
import {useDrag, useDrop} from "react-dnd";
import {addMaintenanceToGroup} from "@/lib/supabase/createMaintenanceGroup";
import {toast} from "react-toastify";
import {useLanguage} from "@/lib/i18n/LanguageContext";

interface Props {
    maintenancePlan: MaintenanceFull;
    refreshCalendar: () => void
}

export default function PlanningCalendarTile(props: Props) {
    const { t, language } = useLanguage();
    
    const [{isDragging}, dragRef] = useDrag(
        () => ({
            type: "PlanningCalendarTile",
            item: {id: props.maintenancePlan.id, planned_date: props.maintenancePlan.planned_date},
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            })
        }),
        []
    )

    const [{isOver}, drop] = useDrop(() => ({
        accept: "PlanningCalendarTile",
        drop: (item: { id: number, planned_date: Date }) => {
            addMaintenanceToGroup(item.id, props.maintenancePlan.id).then(() => {
                toast(t('planning.groupCreated'), {type: "success"})
                props.refreshCalendar()
            }).catch((e) => {
                toast(t('planning.groupCreateError'), {type: "error"})
                console.error(e)
            })
        },
        collect: monitor => ({
            isOver: monitor.isOver(),
        }),
    }))

    // Translate maintenance type for display
    const maintenanceTypeLabel = props.maintenancePlan.maintenance_type === "Corrective" 
        ? t('maintenance.corrective') 
        : t('maintenance.preventive');

    return (
        <div
            ref={el => {
                dragRef(el);
                drop(el)
            }}
            className={"block rounded border p-2 shadow-lg shadow-black/5 text-left bg-white transition-all hover:opacity-70 hover:shadow-xl " + (isDragging ? "!opacity-50 " : "") + (isOver ? "!bg-blue-50" : "")}
            key={props.maintenancePlan.id}>
            <div className="flex">
                <span className="block text-sm uppercase font-bold mr-auto">
                    {props.maintenancePlan.mold_name}
                </span>
                <span className="block text-xs">
                    {new Intl.DateTimeFormat(language === 'nl' ? 'nl' : 'en', {timeStyle: 'short'}).format(props.maintenancePlan.planned_date)}
                </span>
            </div>

            <span className="flex w-full gap-2 items-center text-xs">
                <span className='block mr-auto'>{props.maintenancePlan.maintenance_action}</span>
                <span className={"block px-2 rounded-full border w-24 text-center " + (props.maintenancePlan.maintenance_type == "Corrective" ? "border-orange-400" : "")}>
                    {maintenanceTypeLabel}
                </span>
            </span>
        </div>
    )
}
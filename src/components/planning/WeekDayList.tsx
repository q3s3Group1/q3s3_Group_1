import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import PlanningCalendarTile from "@/components/planning/PlanningCalendarTile";
import FullMaintenanceDetails from "@/components/planning/FullMaintenanceDetails";
import {MaintenanceFull} from "@/types/supabase";
import {updateMaintenanceDate} from "@/lib/supabase/updateMaintenanceDate";
import {toast} from "react-toastify";
import {useDrop} from "react-dnd";

interface WeekDay {
    dayDate: Date,
    maintenancePlans: MaintenanceFull[]
}

interface Props {
    weekDay: WeekDay,
    onMaintenanceEdited: () => void,
}

export default function WeekDayList(props: Props) {
    function maintenanceDroppedOn(item: { id: number, planned_date: Date }) {
        const newDate = new Date(props.weekDay.dayDate)

        newDate.setHours(item.planned_date.getHours())
        newDate.setMinutes(item.planned_date.getMinutes())

        updateMaintenanceDate(item.id, newDate).then(() => {
            toast("Datum van onderhoudsbeurt is aangepast.", {type: 'success'})
            props.onMaintenanceEdited()
        }).catch((e) => {
            toast("Kon datum van onderhoudsbeurt niet aanpassen.", {type: "error"})
            console.error(e)
        });
    }


    const [{isOver}, drop] = useDrop(() => ({
        accept: "PlanningCalendarTile",
        drop: (item: { id: number, planned_date: Date }) => maintenanceDroppedOn(item),
        collect: monitor => ({
            isOver: monitor.isOver(),
        }),
    }))

    return (
        <div
            className={"flex flex-grow gap-2 bg-white border-b p-3 flex-col transition-all " + (isOver ? "!bg-blue-50" : "")}
            ref={el => {
                drop(el)
            }}>
            <div
                className={"w-full h-full flex items-center align-center justify-center " + (props.weekDay.maintenancePlans.length == 0 ? "" : "hidden")}>
                                    <span
                                        className={"block text-sm text-neutral-400"}>Er is vandaag niks gepland.</span>
            </div>
            {props.weekDay.maintenancePlans.sort(m => m.planned_date.getTime()).map((maintenancePlan) => (
                <Dialog key={maintenancePlan.id}>
                    <DialogTrigger>
                        <PlanningCalendarTile maintenancePlan={maintenancePlan}/>
                    </DialogTrigger>
                    <DialogContent className={"rounded-xl"}>
                        <DialogTitle>Onderhoudsbeurt</DialogTitle>
                        <FullMaintenanceDetails onEdited={props.onMaintenanceEdited}
                                                maintenance={maintenancePlan}/>
                    </DialogContent>
                </Dialog>
            ))}
        </div>
    )
}
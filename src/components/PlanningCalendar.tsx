"use client";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {useEffect, useState} from "react";
import {addDays} from "date-fns";
import {getDayName, sameDay} from "@/lib/utils";
import CreatePlanDialog from "./planning/CreatePlanDialog";
import PlanningCalendarTile from "@/components/planning/PlanningCalendarTile";
import {Dialog, DialogContent, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import FullMaintenanceDetails from "@/components/planning/FullMaintenanceDetails";
import { fetchMaintenance } from "@/lib/supabase/fetchMaintenance";
import { MaintenanceFull } from "@/types/supabase";

interface WeekDay {
    dayDate: Date,
    maintenancePlans: MaintenanceFull[]
}

export default function PlanningCalendar() {
    function addWeek() {
        setCurrentDate(addDays(currentDate, 7));
    }

    function removeWeek() {
        setCurrentDate(addDays(currentDate, -7));
    }


    function getCurrentDateStartingMonday() {
        let date = new Date(Date.now())
        const difference = date.getDay() - 1
        date = addDays(date, -difference)
        return date
    }

    const [currentDate, setCurrentDate] = useState(getCurrentDateStartingMonday);
    const [weekDays, setWeekDays] = useState<WeekDay[]>([]);

    function refreshCalendar() {
        let fetchedMaintenancePlans: MaintenanceFull[] = []

        fetchMaintenance(currentDate, addDays(currentDate, 7)).then((fetchedPlans) => {
            fetchedMaintenancePlans = fetchedPlans
            const weekDaysTemp = []
            for (let i = 0; i < 7; i++) {
                weekDaysTemp.push({
                    dayDate: addDays(currentDate, i),
                    maintenancePlans: fetchedMaintenancePlans.filter(m => sameDay(new Date(m.planned_date), addDays(currentDate, i))),
                });
            }
            setWeekDays(weekDaysTemp);
        })
    }

    useEffect(() => {
        refreshCalendar()
    }, [currentDate])

    return (
        <div className={"w-full h-full"}>
            <div className="flex gap-2 w-full bg-white px-6 py-4 rounded text-md font-medium border-b items-center">
                <span className="block mr-3">Onderhoudsplanning</span>
                <div className="flex gap-2 text-sm items-center mr-auto">
                    <button onClick={removeWeek}><ChevronLeft/></button>
                    <span
                        className="block w-24 text-center">{new Intl.DateTimeFormat("nl", {dateStyle: "medium"}).format(currentDate)}</span>
                    <button onClick={addWeek}><ChevronRight/></button>
                </div>

                <CreatePlanDialog formData={{}} onCreatedNewPlanning={refreshCalendar}/>
            </div>

            <div className={"flex flex-col"}>
                {weekDays.map((weekDay) => (
                    <div key={weekDay.dayDate.getTime()} className="flex w-full">
                        <div className="w-44 aspect-square bg-white p-5 flex flex-col border-b border-r">
                            <span
                                className={"block flex-grow mb-auto"}>{weekDay.dayDate.getDate()}</span>
                            <div className="block">
                              <span
                                  className="block">{getDayName(weekDay.dayDate)}</span>
                                <span
                                    className="block">{new Intl.DateTimeFormat("nl", {dateStyle: "medium"}).format(weekDay.dayDate)}</span>
                            </div>
                        </div>
                        <div className={"flex flex-grow gap-2 bg-white border-b p-3 flex-col"}>
                            <div
                                className={"w-full h-full flex items-center align-center justify-center " + (weekDay.maintenancePlans.length == 0 ? "" : "hidden")}>
                                <span className={"block text-sm text-neutral-400"}>Er is vandaag niks gepland.</span>
                            </div>
                            {weekDay.maintenancePlans.sort(m => new Date(m.planned_date).getTime()).map((maintenancePlan) => (
                                <Dialog key={maintenancePlan.id}>
                                    <DialogTrigger>
                                        <PlanningCalendarTile maintenancePlan={maintenancePlan}/>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogTitle>Onderhoudsbeurt</DialogTitle>
                                        <FullMaintenanceDetails maintenance={maintenancePlan}/>
                                    </DialogContent>
                                </Dialog>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
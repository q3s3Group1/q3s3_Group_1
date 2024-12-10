"use client";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {useEffect, useState} from "react";
import {addDays} from "date-fns";
import {getDayName, sameDay} from "@/lib/utils";
import CreatePlanDialog from "./planning/CreatePlanDialog";
import {fetchAllMaintenance} from "@/lib/supabase/fetchAllMaintenance";
import {MaintenanceFull, Mechanic} from "@/types/supabase";
import WeekDayList from "@/components/planning/WeekDayList";
import {fetchMechanics} from "@/lib/supabase/fetchMechanics";
import {fetchMechanic} from "@/lib/supabase/fetchMechanic";

interface WeekDay {
    dayDate: Date,
    maintenancePlans: MaintenanceFull[]
}

interface Props {
    mechanic: number | null
}

export default function PlanningCalendar(props: Props) {
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
    const [mechanic, setMechanic] = useState<Mechanic | null>(null)

    useEffect(() => {
        if (props.mechanic !== null) {
            fetchMechanic(props.mechanic).then((retrievedMechanic) => {
                setMechanic(retrievedMechanic)
            })
        }
    });

    function refreshCalendar() {
        let fetchedMaintenancePlans: MaintenanceFull[] = []

        fetchAllMaintenance(currentDate, addDays(currentDate, 7), props.mechanic).then((fetchedPlans) => {
            fetchedMaintenancePlans = fetchedPlans
            const weekDaysTemp = []
            for (let i = 0; i < 7; i++) {
                weekDaysTemp.push({
                    dayDate: addDays(currentDate, i),
                    maintenancePlans: fetchedMaintenancePlans.filter(m => sameDay(m.planned_date, addDays(currentDate, i))),
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
            {
                props.mechanic !== null && mechanic !== null && (
                    <div className="flex w-full p-3 bg-orange-100">
                        <span className="block mr-auto">Je bekijkt nu de planning voor {mechanic.name}</span>
                        <a href="/dashboard/maintenance/mechanics" className="">Terug</a>
                    </div>
                )
            }

            <div className="flex gap-2 w-full bg-white px-6 py-4 rounded text-md font-medium border-b items-center">
                <span className="hidden lg:block mr-3 ">Onderhoudsplanning</span>
                <div className="flex gap-2 text-sm items-center mr-auto">
                    <button
                        className="flex items-center justify-center aspect-square w-8 rounded hover:bg-neutral-100 transition-colors"
                        onClick={removeWeek}>
                        <ChevronLeft/></button>
                    <span
                        className="block w-24 text-center">{new Intl.DateTimeFormat("nl", {dateStyle: "medium"}).format(currentDate)}</span>
                    <button
                        className="flex items-center justify-center aspect-square w-8 rounded hover:bg-neutral-100 transition-colors"
                        onClick={addWeek}><ChevronRight/></button>
                </div>

                <CreatePlanDialog formData={{}} onCreatedNewPlanning={refreshCalendar}/>
            </div>

            <div className={"flex flex-col "}>
                {weekDays.map((weekDay) => (
                    <div key={weekDay.dayDate.getTime()} className="flex w-full">
                        <div className="aspect-square w-40 min-w-40 bg-white p-5 flex flex-col border-b border-r">
                            <span
                                className={"flex items-center justify-center text-neutral-800 w-9 mb-auto bg-neutral-200 rounded-full aspect-square " + ((new Date(Date.now()).getDate() == weekDay.dayDate.getDate() && new Date(Date.now()).getMonth() == weekDay.dayDate.getMonth()) ? '!bg-blue-200' : '')}>{weekDay.dayDate.getDate()}</span>
                            <div className="block">
                              <span
                                  className="block">{getDayName(weekDay.dayDate)}</span>
                                <span
                                    className="block">{new Intl.DateTimeFormat("nl", {dateStyle: "medium"}).format(weekDay.dayDate)}</span>
                            </div>
                        </div>
                        <WeekDayList weekDay={weekDay} onMaintenanceEdited={refreshCalendar}/>
                    </div>
                ))}
            </div>
        </div>
    );
}
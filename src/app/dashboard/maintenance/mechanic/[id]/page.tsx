"use client"

import PlanningCalendar from "@/components/PlanningCalendar";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";
import Header from "@/app/dashboard/header";
import {useParams} from "next/navigation";

export default function Page() {
    const {id} = useParams()

    return (
        <DndProvider backend={HTML5Backend}>
            <Header/>
            <PlanningCalendar mechanic={Number(id)}/>
        </DndProvider>
    )
}
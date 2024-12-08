"use client"

import PlanningCalendar from "@/components/PlanningCalendar";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";

export default function Page() {
    return (
        <DndProvider backend={HTML5Backend}>
            <PlanningCalendar/>
        </DndProvider>
    )
}
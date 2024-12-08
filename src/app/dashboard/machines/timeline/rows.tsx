"use client";
import TimelineLegend from "@/components/timeline/TimelineLegend";
import TimelineRow from "@/components/timeline/TimelineRow";
import { Machine } from "@/types/supabase";
import Header from "../../header";
import { SelectStartEndDate } from "@/components/SelectStartEndDate";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";

interface RowsProps {
    machines: Machine[];
    }


export default function Rows({ machines }: RowsProps) {

    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2020, 8, 15),
        to: new Date(2020, 8, 17),
      })

  return (
    
    <div className="flex flex-col gap-1 ">
        <div className="sticky top-0 z-10 bg-white shadow-sm">
        <Header>
        <SelectStartEndDate
            date={date}
            setDate={setDate}
            className="w-min"
        />
        </Header>
      <TimelineLegend />
      </div>
      <div className="flex-1 overflow-auto px-4">
      {machines.map((machine) => (
        <TimelineRow 
          key={machine.machine_id} 
          machine={machine} 
          targetEfficiency={0} 
            date={date}
            setDate={setDate}
        />
      ))}
      </div>
         
    </div>
  )
}
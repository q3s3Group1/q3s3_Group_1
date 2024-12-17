"use client";
import TimelineLegend from "@/components/timeline/TimelineLegend";
import TimelineRow from "@/components/timeline/TimelineRow";
import { Machine } from "@/types/supabase";
import Header from "../../header";
import { SelectStartEndDate } from "@/components/SelectStartEndDate";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { IntervalType, SelectInterval } from "@/components/SelectInterval";

interface RowsProps {
    machines: Machine[];
    }


export default function Rows({ machines }: RowsProps) {

    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(2020, 8, 15),
        to: new Date(2020, 8, 17),
      })

    const [interval, setInterval] = useState<IntervalType>(
      IntervalType.Hour
    );

  return (
    
    <div className="flex flex-col gap-1 ">
        <div className="sticky top-0 z-10 bg-white shadow-sm">
        <Header
        title={"Historische data"}
        description="Hier kun je de historische data van de machines shots bekijken"
        >

<div className="flex gap-2">
<SelectInterval
            interval={interval}
            setInterval={setInterval}

          />
          
        <SelectStartEndDate
            date={date}
            setDate={setDate}
            className="w-min"
        />
</div>
        

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
            interval={interval}
            
        />
      ))}
      </div>
         
    </div>
  )
}
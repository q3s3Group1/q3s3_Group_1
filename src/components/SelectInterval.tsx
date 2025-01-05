import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DateRange } from "react-day-picker"
import { IntervalType } from "@/types/enum";


interface SelectIntervalProps {
  interval: IntervalType,
  date?: DateRange,
    setInterval: React.Dispatch<React.SetStateAction<IntervalType>>,
    }

export function SelectInterval({ interval, setInterval, date
}: SelectIntervalProps) {
  // if the date range is over a month, change the interval to week, and if it's over a week, change it to day, and if it's over a day, change it to hour
  // if its less than a 2 days, change it to minute
  React.useEffect(() => {
    if (date && date.from && date.to) {
      const diff = date.to.getTime() - date.from.getTime();
      if (diff > 1000 * 60 * 60 * 24 * 30) {
        setInterval(IntervalType.Week);
      } else if (diff > 1000 * 60 * 60 * 24 * 7) {
        setInterval(IntervalType.Day);
      } else if (diff > 1000 * 60 * 60 * 24) {
        setInterval(IntervalType.Hour);
      } else if (diff < 1000 * 60 * 60 * 24 * 2) {
        setInterval(IntervalType.FiveMinutes);
      }
    }
  }
  , [date]);





  return (
    <Select onValueChange={(value) => setInterval(value as IntervalType)} value={interval}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a interval" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Intervals</SelectLabel>
            <SelectItem value={IntervalType.Minute}>Shots per minute</SelectItem>
            <SelectItem value={IntervalType.FiveMinutes}>Shots per 5 minutes</SelectItem>
            <SelectItem value={IntervalType.Hour}>Shots per hour</SelectItem>
            <SelectItem value={IntervalType.Day}>Shots per day</SelectItem>
            <SelectItem value={IntervalType.Week}>Shots per week</SelectItem>
            

        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

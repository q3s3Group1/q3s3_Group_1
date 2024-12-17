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

export enum IntervalType {
  Minute = "minute",
  FiveMinutes = "5 minute",
  Hour = "hour",
  HalfDay = "half_day",
  Day = "day",
  Week = "week",
}

interface SelectIntervalProps {
  interval: IntervalType,
    setInterval: React.Dispatch<React.SetStateAction<IntervalType>>,
    }

export function SelectInterval({ interval, setInterval, 
}: SelectIntervalProps) {
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
            <SelectItem value={IntervalType.HalfDay}>Shots per half day</SelectItem>
            <SelectItem value={IntervalType.Day}>Shots per day</SelectItem>
            <SelectItem value={IntervalType.Week}>Shots per week</SelectItem>
            

        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

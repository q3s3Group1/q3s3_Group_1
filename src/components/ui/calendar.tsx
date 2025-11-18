"use client"

import * as React from "react"
import { DayPicker, DateRange } from "react-day-picker"
import "react-day-picker/dist/style.css"

function startOfDay(d: Date) {
  const c = new Date(d)
  c.setHours(0, 0, 0, 0)
  return c
}

function endOfDay(d: Date) {
  const c = new Date(d)
  c.setHours(23, 59, 59, 999)   // inclusive end
  return c
}

export type CalendarProps = {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  startMonth?: Date
  endMonth?: Date
  numberOfMonths?: number
  className?: string
  autoApply?: true // apply automatically when both dates are selected
}

export function Calendar({
  value,
  onChange,
  startMonth = new Date(2000, 0),
  endMonth = new Date(new Date().getFullYear(), 11),
  numberOfMonths = 2,
  className,
  autoApply = true, // default to true (auto save)
}: CalendarProps) {
  const [range, setRange] = React.useState<DateRange | undefined>(value)
  const [month, setMonth] = React.useState<Date>(value?.from ?? new Date())
  const wrapperRef = React.useRef<HTMLDivElement>(null)

  // update internal state if parent resets/changes
  React.useEffect(() => setRange(value), [value?.from?.getTime(), value?.to?.getTime()])

  const commit = React.useCallback(
  (r?: DateRange) => {
    if (r?.from && r?.to) {
      const normalized = {
        from: startOfDay(r.from),
        to: endOfDay(r.to),          // <-- inclusive last day
      }
      onChange?.(normalized)
    } else {
      onChange?.(r)
    }
  },
  [onChange]
)


 const handleSelect = (r: DateRange | undefined) => {
  // if user clicked only one day, treat it as a single-day range
  if (r?.from && !r?.to) {
    const singleDay: DateRange = { from: r.from, to: r.from }
    setRange(singleDay)
    if (autoApply) commit(singleDay)
    return
  }

  // normal 2-date selection
  setRange(r)
  if (autoApply && r?.from && r?.to) commit(r)
}
  // handle outside click (only needed if autoApply=false)
  React.useEffect(() => {
    if (autoApply) return
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        commit(range)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [autoApply, range, commit])

  const handleApply = () => commit(range)

  return (
    <div ref={wrapperRef} className={className}>
      <DayPicker
        mode="range"
        numberOfMonths={numberOfMonths}
        selected={range}
        onSelect={handleSelect}
        month={month}
        onMonthChange={setMonth}
        showOutsideDays
        captionLayout="dropdown"
        startMonth={startMonth}
        endMonth={endMonth}
        className="rounded-lg p-2"
        classNames={{
          caption: "flex justify-center items-center pt-1 relative",
          caption_label: "text-sm font-medium text-gray-900",
          head_row: "flex",
          head_cell: "w-8 text-xs text-gray-500",
          row: "flex w-full mt-2",
          day: "h-8 w-8 p-0 text-sm rounded-md hover:bg-gray-100 aria-selected:opacity-100",
          day_selected: "bg-black text-white hover:bg-black",
          day_today: "bg-gray-100",
          day_outside: "text-gray-400",
          day_range_start: "rounded-l-md",
          day_range_end: "rounded-r-md",
          day_range_middle: "bg-gray-100",
        }}
      />

      {/* Apply button (only visible when autoApply=false) */}
      {!autoApply && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleApply}
            disabled={!range?.from || !range?.to}
            className="rounded-md bg-black text-white px-4 py-2 text-sm hover:bg-black/90 disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  )
}

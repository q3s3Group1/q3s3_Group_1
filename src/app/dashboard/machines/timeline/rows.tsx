"use client";
import TimelineLegend from "@/components/timeline/TimelineLegend";
import TimelineRow from "@/components/timeline/TimelineRow";
import { Machine } from "@/types/supabase";
import Header from "../../header";
import { SelectStartEndDate } from "@/components/SelectStartEndDate";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { SelectInterval } from "@/components/SelectInterval";
import { IntervalType } from "@/types/enum";
import { fetchMachines } from "@/lib/supabase/fetchMachines";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Rows({ machines: initialMachines }: { machines: Machine[] }) {
  const { t } = useLanguage();

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2020, 8, 4),
    to: addDays(new Date(2020, 8, 4), 1),
  });
  const [interval, setInterval] = useState<IntervalType>(IntervalType.Hour);
  const [machines, setMachines] = useState<Machine[]>(initialMachines);
  const [loading, setLoading] = useState(false);

  const refTs: Date | undefined = useMemo(() => date?.from, [date]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const data = await fetchMachines(refTs);
        setMachines(data);
      } finally {
        setLoading(false);
      }
    };
    if (refTs) run();
  }, [refTs]);

  return (
    <div className="flex flex-col gap-1">
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <Header
          title={t("machines.history")}
          description={t("machines.historyDescription", { /* optional params */ })}
        >
          <div className="flex gap-2">
            <SelectInterval
              interval={interval}
              setInterval={setInterval}
              date={date}
              setDate={setDate}
            />
            <SelectStartEndDate date={date} setDate={setDate} className="w-min" />
          </div>
        </Header>
        <TimelineLegend />
      </div>

      <div className="flex-1 overflow-auto px-4">
        {loading && <div className="p-4 text-sm text-gray-500">{t("common.loading")}</div>}
        {!loading && machines.map((machine) => (
          <TimelineRow
            key={machine.machine_id}
            machine={machine}
            targetEfficiency={0}
            date={date}
            interval={interval}
          />
        ))}
        {!loading && machines.length === 0 && (
          <div className="p-4 text-sm text-gray-500">{t("machines.noMachinesForDate")}</div>
        )}
      </div>
    </div>
  );
}

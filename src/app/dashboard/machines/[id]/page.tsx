"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { fetchMachine } from "@/lib/supabase/fetchMachines";
import { fetchChartData } from "@/lib/supabase/fetchMachineTimelines";
import { Machine, MachineTimeline, Mold } from "@/types/supabase";
import StatusIndicator from "@/components/timeline/StatusIndicator";
import { SelectStartEndDate } from "@/components/SelectStartEndDate";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Header from "../../header";
import { fetchMachineMolds } from "@/lib/supabase/fetchMachineMolds";


const chartConfig: ChartConfig = {
  average_shot_time: { label: "Average Shot Time", color: "hsl(100, 70%, 50%)" },
  total_shots: { label: "Total Shots", color: "hsl(100, 70%, 50%)" },
};

const MachinePage = () => {
  const { id } = useParams();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [chartData, setChartData] = useState<MachineTimeline[]>([]);
  // molds
  const [molds, setMolds] = useState<Mold[]>([]);
  // set interval
  const [interval, setInterval] = useState<"minute" | "hour" | "day">("hour");

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2020, 8, 0),
    to: new Date(2020, 8, 20),
  })



  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        // Fetch machine data
        const machineData = await fetchMachine(id.toString());
        setMachine(machineData);
        
        const moldsfetched = await fetchMachineMolds(
          machineData.machine_id
        );

        setMolds(moldsfetched);

        const startDate = date?.from;
        const endDate = date?.to;

      if (!startDate) return;
      if (!endDate) return;

        // Fetch chart data
        const data = await fetchChartData(
          machineData.board,
          machineData.port,
          startDate,
          endDate,
          interval
        );
        setChartData(
          data
        );


      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [id, date, interval]);

  if (!machine) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <Header
    title={`Machine: ${machine.machine_name || `${machine.machine_id}`}`}
    />
    <div>
      <CardHeader className="flex items-center justify-between gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Machine: {machine.machine_name || `${machine.machine_id}`
            }</CardTitle>
          <CardDescription className="flex items-center justify-start gap-1">
            <StatusIndicator status={machine.status} />
            Status: {machine.status}</CardDescription>
        </div>
       <div className="flex items-center gap-2">
       <SelectStartEndDate
          date={date}
         setDate={setDate}
         className="w-min"
        />
        
        <Select onValueChange={(value) => setInterval(value as "minute" | "hour" | "day")} value={interval}>
          <SelectTrigger>
            <SelectValue defaultValue={"hour"}>
              
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="minute">Minute</SelectItem>
            <SelectItem value="hour" >Hour</SelectItem>
            <SelectItem value="day">Day</SelectItem>
          </SelectContent>
        </Select>

       </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillTotalShots" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-total-shots)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total-shots)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="fillAverageShotTime"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-average-shot-time)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-average-shot-time)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.toFixed(0)}
            />
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="truncated_timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleString("nl-NL");
              }}
            />
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleString("nl-NL")
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="total_shots"
              type="natural"
              fill="url(#fillTotalShots)"
              stroke="var(--color-total-shots)"
              stackId="a"
            />
            <Area
              dataKey="average_shot_time"
              type="natural"
              fill="url(#fillAverageShotTime)"
              stroke="var(--color-average-shot-time)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      <div className="p-4 container mx-auto">
      <Card>
        <CardHeader>
        <CardTitle>Molds</CardTitle>
        </CardHeader>
        <CardContent>
         
          <ul className="list-disc">
            {molds.map((mold) => (
              <li key={mold.id}>
                {mold.description} ({mold.id})
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      </div>
    </div></>
  );
};

export default MachinePage;

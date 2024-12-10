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
import { Machine, MachineTimeline, MaintenanceFull, Mold } from "@/types/supabase";
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
import { fetchMaintenanceByMoldId } from "@/lib/supabase/fetchAllMaintenance";
import { fetchMold, fetchMolds } from "@/lib/supabase/fetchMolds";
import Header from "../../header";


const chartConfig: ChartConfig = {
  average_shot_time: { label: "Average Shot Time", color: "hsl(100, 70%, 50%)" },
  total_shots: { label: "Total Shots", color: "hsl(100, 70%, 50%)" },
};

const MachinePage = () => {
  const { id } = useParams();
  const [mold, setMold] = useState<Mold | null>(null);
  const [chartData, setChartData] = useState<MachineTimeline[]>([]);

  const [maintenance, setMaintenance] = useState<MaintenanceFull[]>([]);


  
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
        const moldData = await fetchMold(
          parseInt(id as string)
        );
        setMold(moldData);

        const maintenanceData = await fetchMaintenanceByMoldId(
          parseInt(id as string)
        );

        setMaintenance(maintenanceData);

        const startDate = date?.from;
        const endDate = date?.to;

      if (!startDate) return;
      if (!endDate) return;

        // Fetch chart data
        const data = await fetchChartData(
          moldData.board,
          moldData.port,
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

  if (!mold) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header
        title={`Mold: ${mold.description}`}
      />
    <div>
      <CardHeader className="flex items-center justify-between gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Mold: {mold.description}
            </CardTitle>
          <CardDescription className="flex items-center justify-start gap-1">
            Status
            
            </CardDescription>
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

      <div className="container px-4 mx-auto">
        <Card>
        <CardHeader className="flex items-center justify-between gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Onderhoudsgeschiedenis</CardTitle>
          <CardDescription className="flex items-center justify-start gap-1">
            
          </CardDescription>
        </div>
      </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {
          maintenance.length > 0 ? (
            maintenance.map((m) => (
          
              <div key={m.id} className="flex items-center gap-2">
    
                <div>
                  <p>{m.planned_date.toLocaleDateString("nl-NL")}</p>
                  <p>
    
                    {m.maintenance_action} by {m.mechanic_name}
    
                  </p>
                  
                </div>
    
              </div>
            ))
          ) : (
            <div>No maintaince planned</div>
          )
        }

        </CardContent>

        </Card>
      </div>
    </div>
    </>
  );
};

export default MachinePage;

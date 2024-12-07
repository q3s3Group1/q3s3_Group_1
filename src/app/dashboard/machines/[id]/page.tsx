"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchMachine } from "@/lib/supabase/fetchMachines";
import { fetchChartData } from "@/lib/supabase/fetchMachineTimelines";
import { Machine, MachineTimeline } from "@/types/supabase";
import StatusIndicator from "@/components/timeline/StatusIndicator";

const chartConfig: ChartConfig = {
  average_shot_time: { label: "Average Shot Time", color: "hsl(var(--chart-1))" },
  total_shots: { label: "Total Shots", color: "hsl(var(--chart-2))" },
};

const MachinePage = () => {
  const { id } = useParams();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [chartData, setChartData] = useState<MachineTimeline[]>([]);
  const [timeRange, setTimeRange] = useState("7d");


  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        // Fetch machine data
        const machineData = await fetchMachine(id.toString());
        setMachine(machineData);

        // Calculate date range based on time range
        const endDate = new Date("2020-09-31");
        const startDate = new Date("2020-09-20");
        if (timeRange === "30d") {
          startDate.setDate(startDate.getDate() - 30);
        } else if (timeRange === "90d") {
          startDate.setDate(startDate.getDate() - 90);
        } else {
          startDate.setDate(startDate.getDate() - 7);
        }

        // Fetch chart data
        const data = await fetchChartData(
          machineData.board,
          machineData.port,
          startDate,
          endDate,
          "hour"
        );
        setChartData(
          data
        );


      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [id, timeRange]);

  if (!machine) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Machine: {machine.machine_name}</CardTitle>
          <CardDescription className="flex items-center justify-start gap-1">
            <StatusIndicator status={machine.status} />
            Status: {machine.status}</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 7 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
          </SelectContent>
        </Select>
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
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
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
    </div>
  );
};

export default MachinePage;

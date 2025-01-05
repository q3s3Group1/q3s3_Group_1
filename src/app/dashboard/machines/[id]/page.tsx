"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, Legend, ComposedChart, Line } from "recharts";
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
import { Machine, MachineTimeline, Mold, MoldHistory, Notification } from "@/types/supabase";
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
import { IntervalType, SelectInterval } from "@/components/SelectInterval";
import { fetchMoldHistoryByBoardPort } from "@/lib/supabase/fetchMoldHistory";
import { MoldHistoryTable } from "../../../../components/molds/moldsHistory";
import { fetchNotificationsByMachineId } from "@/lib/supabase/notification";
import NotificationTabs from "../../notifications/tabs";

const chartConfig = {
  // red
  average_shot_time: { label: "Avg. Shot", color: "hsl(0, 70%, 50%)" },
  //
  total_shots: { label: "Total Shots", color: "hsl(200, 70%, 50%)" },
};

const MachinePage = () => {
  const { id } = useParams();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [chartData, setChartData] = useState<MachineTimeline[]>([]);



    const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // molds
  const [moldsHistory, setMoldsHistory] = useState<MoldHistory[]>([]);
  // set interval
  const [interval, setInterval] = useState<IntervalType>(
    IntervalType.Hour
  );

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2020, 8, 0),
    to: new Date(2020, 8, 20),
  })

  useEffect(() => {
    fetchNotificationsByMachineId(parseInt(id as string)).then((data) => {
      setNotifications(data);
    });
  }
  , [id]);




  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        // Fetch machine data
        const machineData = await fetchMachine(id.toString());
        setMachine(machineData);
        
        const moldsfetched = await fetchMoldHistoryByBoardPort(
          machineData.board,
          machineData.port
        );

        setMoldsHistory(moldsfetched);

        // log molds history
        console.log('moldsHistory', moldsfetched);

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
            <CardDescription className="flex items-center justify-start gap-1">
              <StatusIndicator status={machine.status} />
              Status: {machine.status}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <SelectStartEndDate
              date={date}
              setDate={setDate}
              className="w-min"
            />

            <SelectInterval interval={interval} setInterval={setInterval} />
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <ComposedChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="truncated_timestamp"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                // Format to the week, so eg 2021-01-01 - 2021-01-07
                tickFormatter={(value) =>
                  value && new Date(value).toLocaleDateString("nl-NL")
                }
              />
              <YAxis
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                domain={[0, 10]}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              {/* <Bar dataKey="total_shots" fill="hsl(200, 70%, 50%)" radius={1} /> */}

              <Bar
                dataKey="total_shots"
                fill={chartConfig.total_shots.color}
                radius={4}
              />

              <Line
              dot={false}
              dataKey="average_shot_time" stroke={chartConfig.average_shot_time.color} />

              <Legend
                content={<ChartLegendContent className="flex flex-wrap" />}
              />
            </ComposedChart>
          </ChartContainer>
        </CardContent>

        <div className="p-4 container mx-auto grid gap-2">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <NotificationTabs notifications={notifications} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Molds History</CardTitle>
            </CardHeader>
            <CardContent>
              <MoldHistoryTable
                moldsHistory={moldsHistory}
                setRange={setDate}
                showMachine={false}
                showMold={true}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default MachinePage;

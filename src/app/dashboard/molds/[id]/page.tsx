"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts";
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
} from "@/components/ui/chart";
import { fetchChartData } from "@/lib/supabase/fetchMachineTimelines";
import { MachineTimeline, MaintenanceFull, Mold, MoldHistory } from "@/types/supabase";
import { SelectStartEndDate } from "@/components/SelectStartEndDate";
import { DateRange } from "react-day-picker";
import { fetchMaintenanceByMoldId } from "@/lib/supabase/fetchAllMaintenance";
import { fetchMold } from "@/lib/supabase/fetchMolds";
import Header from "../../header";
import { IntervalType, SelectInterval } from "@/components/SelectInterval";
import { fetchMoldHistoryByMoldId } from "@/lib/supabase/fetchMoldHistory";
import { MoldHistoryTable } from "@/components/molds/moldsHistory";

export interface BoardPort {
  board: number;
  port: number;
}

const MachinePage = () => {
  const { id } = useParams();
  const [mold, setMold] = useState<Mold | null>(null);
  const [chartData, setChartData] = useState<MachineTimeline[]>([]);

  const [maintenance, setMaintenance] = useState<MaintenanceFull[]>([]);

  const [moldsHistory, setMoldsHistory] = useState<MoldHistory[]>([]);

  // board and port
  const [boardPort, setBoardPort] = useState<BoardPort | null>(null);
  
  // set interval
  const [interval, setInterval] = useState<IntervalType>(IntervalType.Hour);

  // reference line
  const [referenceLine, setReferenceLine] = useState<number | undefined>();

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

      


       

        

      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [id, date, interval]);

  useEffect(() => {
      const loadMoldHistory = async () => {
        const moldHistoryData = await fetchMoldHistoryByMoldId(
          parseInt(id as string)
        );
  
        setMoldsHistory(moldHistoryData);
      };
  
      loadMoldHistory();
    }, [id]);

  useEffect(() => {
    if (moldsHistory.length > 0) {
      setBoardPort({
        board: moldsHistory[0].board,
        port: moldsHistory[0].port,
      });


      
    }
  }
  , [moldsHistory]);

  useEffect(() => {
    // Chart data
    const startDate = date?.from;
    const endDate = date?.to;

    if (!startDate) return;
    if (!endDate) return;

    const loadData = async () => {
      if (!boardPort) return;

      try {
        const data = await fetchChartData(
          boardPort.board,
          boardPort.port,
          startDate,
          endDate,
          interval
        );
        setChartData(data);

        const totalShots = data.map((d) => d.total_shots);
        const avg = totalShots.reduce((a, b) => a + b, 0) / totalShots.length;
        setReferenceLine(avg);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [boardPort, date, interval]);


  if (!mold) {
    return <div>Loading...</div>;
  }


  return (
    <>
      <Header
        title={`Mold: ${mold.mold_name || mold.mold_id}`}
      />
    <div>
      <CardHeader className="flex items-center justify-between gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
         
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
        
       <SelectInterval
         interval={interval}
         setInterval={setInterval}
        />

       </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={
           {} as ChartConfig
          }
          className="aspect-auto h-[250px] w-full"
        >
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                 
                <XAxis
                  dataKey="truncated_timestamp"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => value && new Date(value).toLocaleString(
                    'nl-NL',
                    {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )}
                />
                <YAxis
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => value.toFixed(0)}
                  domain={[0, 5]}
                />
                <Line
                  type="monotone"
                  dataKey="total_shots"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={false}
                  
                />
                 <ReferenceLine y={referenceLine} stroke="black" 
                  label={{ position: 'insideBottomLeft', value: `Avg. ${referenceLine?.toFixed(0)} Shots / ${interval}`, fill: 'black', fontSize: 12 }} />
                  <Tooltip
                  formatter={(value) => value.toLocaleString("nl-NL", {
                    maximumFractionDigits: 0,
                    
                  })}
                  />
                </LineChart>
        </ChartContainer>
      </CardContent>

      <div className="container px-4 mx-auto flex flex-col gap-4">
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

        <Card>
          <CardHeader>
                  <CardTitle>Machine History</CardTitle>
                  </CardHeader>
                  <CardContent>

          <MoldHistoryTable
            moldsHistory={moldsHistory}
            showMachine={true}
            showMold={false}
            setRange={setDate}
            setBoardPort={setBoardPort}
          />
                  </CardContent>

        </Card>
      </div>
    </div>
    </>
  );
};

export default MachinePage;

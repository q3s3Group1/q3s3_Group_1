"use client";
import React, { useEffect, useState } from 'react';
import MachineCard from './MachineCard';
import { Machine, MachineTimeline, Mold, MoldHistory } from '@/types/supabase';
import { fetchChartData } from '@/lib/supabase/fetchMachineTimelines';
import { supabase } from '@/lib/supabase/client';
import { addDays } from 'date-fns';
import { fetchMoldsByDateRange } from '@/lib/supabase/fetchMachineMolds';
import { IntervalType } from '@/types/enum';

interface FactoryGridProps {
  machines: Machine[];
  currentTime: Date;
}

export default function FactoryGrid({ machines, currentTime }: FactoryGridProps) {
  const [machineData, setMachineData] = useState<Record<string, { matrijzen: MoldHistory[]; chartData: MachineTimeline[] }>>({});
  // state current time
  const [rightNow, setRightNow] = useState(new Date());


  const today = currentTime;

  // every 5 seconds update the current time
  useEffect(() => {
    const interval = setInterval(() => {
      setRightNow(new Date());
    }, 20000);

    return () => clearInterval(interval);
  }, []);



  useEffect(() => {
    const fetchData = async () => {
      const data = await Promise.all(
        machines.map(async (machine) => {
          const matrijzen = await fetchMoldsByDateRange(addDays(today, -1), today, machine.board, machine.port);
          const chartData = await fetchChartData(
            machine.board,
            machine.port,
            addDays(today, -1),
            rightNow,
            IntervalType.Hour,
            true
          );
          return { machineId: machine.machine_id, matrijzen, chartData };
        })
      );


      setMachineData(
        data.reduce((acc, { machineId, matrijzen, chartData }) => {
          acc[machineId.toString()] = { matrijzen, chartData };
          return acc;
        }, {} as Record<string, { matrijzen: MoldHistory[]; chartData: MachineTimeline[] }
        >)
      );

    };

    fetchData();
  }, [machines, currentTime]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 min-h-0 p-2">
        {machines.map((machine) => {
          const machineSpecificData = machineData[machine.machine_id];
          return (
            <MachineCard
              key={machine.machine_id}
              machine={machine}
              molds={machineSpecificData?.matrijzen || []}
              chartData={machineSpecificData?.chartData || []}
            />
          );
        })}
      </div>
    </div>
  );
}

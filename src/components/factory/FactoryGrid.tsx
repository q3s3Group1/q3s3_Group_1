"use client";
import React, { useEffect, useState } from 'react';
import MachineCard from './MachineCard';
import { Machine, MachineTimeline, Mold } from '@/types/supabase';
import { fetchMachineMolds } from '@/lib/supabase/fetchMachineMolds';
import { fetchChartData } from '@/lib/supabase/fetchMachineTimelines';
import { addDays } from 'date-fns';

interface FactoryGridProps {
  machines: Machine[];
}

export default function FactoryGrid({ machines }: FactoryGridProps) {
  const [machineData, setMachineData] = useState<{
    [machineId: string]: { matrijzen: Mold[]; chartData: MachineTimeline[] };
  }>({});

  const today = new Date("2020-09-05");

  useEffect(() => {
    const fetchData = async () => {
      const data = await Promise.all(
        machines.map(async (machine) => {
          const matrijzen = await fetchMachineMolds(machine.machine_id);
          const chartData = await fetchChartData(
            machine.board,
            machine.port,
            addDays(today, -1),
            today,
            "hour"
          );
          return { machineId: machine.machine_id, matrijzen, chartData };
        })
      );

      // Transform array into a map for faster access
      const dataMap = data.reduce((acc, item) => {
        acc[item.machineId] = { matrijzen: item.matrijzen, chartData: item.chartData };
        return acc;
      }, {} as { [machineId: string]: { matrijzen: Mold[]; chartData: MachineTimeline[] } });

      setMachineData(dataMap);
    };

    fetchData();
  }, [machines]);

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

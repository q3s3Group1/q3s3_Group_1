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

  const today = currentTime;

  const getStatus = (chartData: MachineTimeline[]) => {
    if (chartData.length === 0) return 'Stilstand';
    const lastData = chartData[chartData.length - 1];
    if (lastData.average_shot_time === 0) return 'Stilstand';
    if (lastData.total_shots === 0) return 'Inactief';
    return 'Actief';
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await Promise.all(
        machines.map(async (machine) => {
          const matrijzen = await fetchMoldsByDateRange(addDays(today, -1), today, machine.board, machine.port);
          const chartData = await fetchChartData(
            machine.board,
            machine.port,
            addDays(today, -1),
            today,
            IntervalType.Hour
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
  }, [machines]);

  const sortedMachines = [...machines].sort((a, b) => {
    const aData = machineData[a.machine_id]?.chartData || [];
    const bData = machineData[b.machine_id]?.chartData || [];
    const statusOrder = { Actief: 0, Inactief: 1, Stilstand: 2 };
    const aStatus = getStatus(aData);
    const bStatus = getStatus(bData);

    return statusOrder[aStatus] - statusOrder[bStatus];
  });

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 min-h-0 p-2">
        {sortedMachines.map((machine) => {
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

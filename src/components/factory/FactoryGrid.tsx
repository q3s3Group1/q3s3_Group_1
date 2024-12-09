"use client";
import React, { useEffect, useState } from 'react';
import MachineCard from './MachineCard';
import { Machine, MachineTimeline, Mold } from '@/types/supabase';
import { fetchMachineMolds } from '@/lib/supabase/fetchMachineMolds';
import { fetchChartData } from '@/lib/supabase/fetchMachineTimelines';
import { supabase } from '@/lib/supabase/client';
import { addDays } from 'date-fns';

interface FactoryGridProps {
  machines: Machine[];
}

export default function FactoryGrid({ machines }: FactoryGridProps) {
  const [machineData, setMachineData] = useState<{
    [machineId: string]: { matrijzen: Mold[]; chartData: MachineTimeline[] };
  }>({});

  const today = new Date("2020-09-05");

  const fetchAndSetChartData = async (machineId: string, board: number, port: number) => {
    const chartData = await fetchChartData(board, port, addDays(today, -1), today, "hour");
    setMachineData((prev) => ({
      ...prev,
      [machineId]: {
        ...prev[machineId],
        chartData,
      },
    }));
  };

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

    // Subscribe to real-time changes in the monitoring_data table
    const subscriptions = machines.map((machine) => {
      const channel = supabase
        .channel(`monitoring_data:${machine.machine_id}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'monitoring_data_202009',
            // Optionally re-add filters
            filter: `board=eq.${machine.board},port=eq.${machine.port}`,
          },
          (payload) => {
            console.log(`Change detected for machine ${machine.machine_id}`, payload);
            // Fetch updated chart data for the specific machine
            fetchAndSetChartData(machine.machine_id.toString(), machine.board, machine.port);
          }
        )
        .subscribe();

      return channel;
    });

    // Cleanup subscriptions on unmount
    return () => {
      subscriptions.forEach((channel) => {
        supabase.removeChannel(channel);
      });
    };
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

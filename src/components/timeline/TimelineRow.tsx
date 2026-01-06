"use client";
import React, {useEffect, useMemo, useState} from 'react';
import StatusIndicator from './StatusIndicator';
import TimelineChart from './TimelineChart';
import {EnergyKPI, Machine, MachineTimeline} from '@/types/supabase';
import { fetchChartData } from '@/lib/supabase/fetchMachineTimelines';
import { Card } from '../ui/card';
import { DateRange } from 'react-day-picker';
import { IntervalType } from '@/types/enum';
import {fetchEnergyData} from "@/lib/supabase/fetchEnergyData";

interface TimelineRowProps {
  machine: Machine;
  targetEfficiency: number;
  style?: React.CSSProperties;
  date: DateRange | undefined;
  interval: IntervalType;
}

const TimelineRow: React.FC<TimelineRowProps> = ({
  machine,
  style,
  date,
  interval,
}) => {
  const [shotsData, setShotsData] = useState<MachineTimeline[]>([]);
  const [energyData, setEnergyData] = useState<EnergyKPI[]>([]);


    useEffect(() => {
        if (!date?.from || !date?.to) return;

        const start: Date = date.from;
        const end: Date = date.to;

        const load = async () => {
            try {
                const shots = await fetchChartData(
                    machine.board,
                    machine.port,
                    start,
                    end,
                    interval
                );
                setShotsData(shots);

                if (
                    interval === IntervalType.Hour ||
                    interval === IntervalType.Day ||
                    interval === IntervalType.Week
                ) {
                    const energy = await fetchEnergyData(
                        machine.board,
                        machine.port,
                        start,
                        end,
                        interval
                    );
                    setEnergyData(energy);
                } else {
                    setEnergyData([]);
                }
            } catch (error) {
                console.error('Error loading data for machine', machine.machine_id, error);
                setShotsData([]);
                setEnergyData([]);
            }
        };


        load();
    }, [machine.board, machine.port, date, interval]);

    //
    // useEffect(() => {
    //     console.log("Energy data updated:", energyData);
    // }, [energyData]);


    const chartData = useMemo(() => {
        if (energyData.length === 0) return shotsData.map(point => ({ ...point, energy_kwh: null }));

        return shotsData.map(point => {
            const energy = energyData.find(e =>
                new Date(e.start_timestamp) <= new Date(point.truncated_timestamp) &&
                new Date(e.end_timestamp) > new Date(point.truncated_timestamp)
            );

            return {
                ...point,
                energy_kwh: energy?.energy_kwh ?? null,
            };
        });
    }, [shotsData, energyData]);


    return (
    <Card style={style} className="mb-2">
        <div className="flex items-center h-12">
          <div className="w-32 flex items-center text-left px-4">
            <div className="flex items-center space-x-3">
              <StatusIndicator
                status={machine.status}
              />
              <span className="text-sm font-medium text-gray-900 truncate">
                {machine.machine_name || `Machine ${machine.machine_id}`}
              </span>
            </div>
          </div>
          <div className="flex-1 h-full">
              {/*<TimelineChart*/}
              {/*    interval={interval}*/}
              {/*    data={liveData}/>*/}
              <TimelineChart
                  interval={interval}
                  data={chartData}
              />

          </div>
        </div>
    </Card>
  );
};

export default React.memo(TimelineRow);




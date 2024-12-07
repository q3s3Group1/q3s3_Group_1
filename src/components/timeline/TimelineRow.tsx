"use client"; 
import React, { useEffect, useState } from 'react';
import StatusIndicator from './StatusIndicator';
import TimelineChart from './TimelineChart';
import { Machine, MachineTimeline } from '@/types/supabase';
import { fetchChartData } from '@/lib/supabase/fetchMachineTimelines';
import { Card } from '../ui/card';

interface TimelineRowProps {
  machine: Machine;
  targetEfficiency: number;
  style?: React.CSSProperties;
}

const TimelineRow: React.FC<TimelineRowProps> = ({
  machine,
  style,
}) => {
  const [liveData, setLiveData] = useState<MachineTimeline[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchChartData(
        machine.board,
        machine.port,
        new Date('2020-09-01 00:00:00'),
        new Date('2020-09-10 23:00:00'),
        'hour'
      );
      setLiveData(data);
    };
    fetchData();
  }, [machine.board, machine.port]);

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
            <TimelineChart data={liveData}/>
          </div>
        </div>
    </Card>
  );
};

export default React.memo(TimelineRow);

import { formatTimestampToInterval } from '@/lib/utils';
import { MachineTimeline } from '@/types/supabase';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { IntervalType } from '../SelectInterval';

interface TimelineChartProps {
  data: MachineTimeline[];
  interval: IntervalType;

  hideAxis?: boolean;
  hideTooltip?: boolean;
  lineColor?: string;
}

const TimelineChart: React.FC<TimelineChartProps> = ({ data, interval, hideAxis = false, lineColor = '#3B82F6', hideTooltip = false }) => (
 data && data.length > 0 ? (
  <ResponsiveContainer width="100%" height="100%">
  <LineChart data={data} margin={
    !hideAxis ? { top: 5, right: 30, left: 20, bottom: 5 } : { top: 0, right: 0, left: 0, bottom: 0 }
  }>
    {!hideAxis && (
      <XAxis
      dataKey="truncated_timestamp"
      tick={{ fontSize: 10 }}
      tickFormatter={(value) => value && formatTimestampToInterval(value, interval)}
    /> 
    )}

    {!hideAxis && (
     
    <YAxis
      tick={{ fontSize: 10 }}
      tickFormatter={(value) => value.toFixed(0)}
    domain={[0, 5]} />
    )}
    
    <ReferenceLine y={"5"} stroke="#9CA3AF" strokeDasharray="3 3" />
    <Line className='z-0 relative' type="monotone" dataKey="total_shots" stroke={lineColor} strokeWidth={2} dot={false} />

    {!hideTooltip && (
      <Tooltip
      content={({ active, payload }) => {
        if (active && payload && payload.length) {
          return (
            <div className="bg-white fixed left-0 p-2 z-50 rounded-lg shadow-md">
              <p className="text-sm text-gray-500">
                {
                  payload[0].payload.truncated_timestamp ? new Date(payload[0].payload.truncated_timestamp).toLocaleString(
                    'nl-NL',
                  ) : ''
                }
              </p>
              <p className="text-sm text-gray-500">
                Shots: {payload[0].payload.total_shots}
              </p>
              {/*     average_shot_time: number;
*/}
            <p className="text-sm text-gray-500">
              Avg shot time: {payload[0].payload.average_shot_time.toFixed(2)}s
            </p>
            </div>
          );
        }
        return null;
      }}
    />
    )}
  </LineChart>
</ResponsiveContainer>
) : (
  <div className="h-full flex items-center justify-center text-gray-400">
    No data available
  </div>
)
);

export default TimelineChart;
  
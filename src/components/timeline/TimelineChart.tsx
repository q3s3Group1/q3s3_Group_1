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

interface TimelineChartProps {
  data: MachineTimeline[];
}

const TimelineChart: React.FC<TimelineChartProps> = ({ data }) => (
 data && data.length > 0 ? (
  <ResponsiveContainer width="100%" height="100%">
  <LineChart data={data} margin={{ top: 5, right: 0, bottom: -10, left: 0 }}>
    <XAxis
      dataKey="truncated_timestamp"
      tick={{ fontSize: 10 }}
      tickFormatter={(value) => value && new Date(value).toLocaleTimeString()}
    />
    <YAxis hide domain={[0, 5]} />
    <Tooltip
      content={({ active, payload }) => {
        if (active && payload && payload.length) {
          return (
            <div className="bg-white p-2 rounded-lg shadow-md">
              <p className="text-sm text-gray-500">
                {
                  payload[0].payload.truncated_timestamp ? new Date(payload[0].payload.truncated_timestamp).toLocaleString() : ''
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
    <ReferenceLine y={"5"} stroke="#9CA3AF" strokeDasharray="3 3" />
    <Line type="monotone" dataKey="total_shots" stroke="#3B82F6" strokeWidth={2} dot={false} />
  </LineChart>
</ResponsiveContainer>
) : (
  <div className="h-full flex items-center justify-center text-gray-400">
    No data available
  </div>
)
);

export default TimelineChart;
  
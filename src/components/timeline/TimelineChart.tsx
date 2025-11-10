import { formatTimestampToInterval } from '@/lib/utils';
import { MachineTimeline } from '@/types/supabase';
import React, { useState, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { IntervalType } from '@/types/enum';

interface TimelineChartProps {
  data: MachineTimeline[];
  interval: IntervalType;
  hideAxis?: boolean;
  hideTooltip?: boolean;
  lineColor?: string;
}

const TimelineChart: React.FC<TimelineChartProps> = ({
  data,
  interval,
  hideAxis = false,
  hideTooltip = false,
  lineColor = '#3B82F6',
}) => {
  const [zoomDomain, setZoomDomain] = useState<MachineTimeline[] | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        No data available
      </div>
    );
  }

  const displayedData = zoomDomain || data;

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setDragStart(x);
    setDragEnd(x);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStart === null) return;
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    setDragEnd(x);
  };

  const handleMouseUp = () => {
  if (dragStart === null || dragEnd === null || !chartRef.current) {
    setDragStart(null);
    setDragEnd(null);
    return;
  }

  const rect = chartRef.current.getBoundingClientRect();
  const innerLeft = 60;  // Approximate left margin for YAxis
  const innerRight = 5; // Approximate right margin
  const plotWidth = rect.width - innerLeft - innerRight;

  // Map pixel to chart plot coordinates
  const startX = Math.min(dragStart, dragEnd) - innerLeft;
  const endX = Math.max(dragStart, dragEnd) - innerLeft;

  const startRatio = Math.max(Math.min(startX / plotWidth, 1), 0);
  const endRatio = Math.max(Math.min(endX / plotWidth, 1), 0);

  // Map ratio to array indices
  const startIndex = Math.floor(startRatio * data.length);
  const endIndex = Math.ceil(endRatio * data.length);

  const newZoom = data.slice(startIndex, endIndex);

  if (newZoom.length > 0) {
    setZoomDomain(newZoom);
  }

  setDragStart(null);
  setDragEnd(null);
};



  const handleResetZoom = () => setZoomDomain(null);

  return (
    <div className="relative h-full w-full">
      {zoomDomain && (
        <button
        onClick={handleResetZoom}
        className="absolute right-2 top-2 z-10 rounded bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200"
      >
        Reset
      </button>
      )}

      <div
        ref={chartRef}
        className="h-full w-full relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {dragStart !== null && dragEnd !== null && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: Math.min(dragStart, dragEnd),
              width: Math.abs(dragEnd - dragStart),
              height: '100%',
              backgroundColor: 'rgba(59,130,246,0.15)',
              border: '1px solid rgba(59,130,246,0.4)',
              pointerEvents: 'none',
              zIndex: 1000,
            }}
          />
        )}

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={displayedData}
            margin={
              !hideAxis
                ? { top: 1, right: 0, left: 0, bottom: -10 }
                : { top: 0, right: 0, left: 0, bottom: 0 }
            }
          >
            {!hideAxis && (
              <XAxis
                dataKey="truncated_timestamp"
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => value && formatTimestampToInterval(value, interval)}
              />
            )}

            {!hideAxis && (
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(value) => value.toFixed(0)} domain={[0, 5]} />
            )}

            {!hideTooltip && (
              <Tooltip
                wrapperStyle={{
                  backgroundColor: 'white',
                  boxShadow: '0px 2px 8px rgba(0,0,0,0.15)',
                  borderRadius: '8px',
                  zIndex: 1000,
                  pointerEvents: 'none',
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="p-2">
                        <p className="text-sm text-gray-700">
                          {payload[0].payload.truncated_timestamp
                            ? new Date(payload[0].payload.truncated_timestamp).toLocaleString('nl-NL')
                            : ''}
                        </p>
                        <p className="text-sm text-gray-700">Shots: {payload[0].payload.total_shots}</p>
                        <p className="text-sm text-gray-700">
                          Avg shot time: {payload[0].payload.average_shot_time.toFixed(2)}s
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            )}

            <ReferenceLine y={5} stroke="#9CA3AF" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="total_shots" stroke={lineColor} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


export default TimelineChart;

import { useState, useEffect } from 'react';
import { supabase } from './client';
import { MonitoringData } from '@/types/supabase';
import { IntervalType } from '@/types/enum';

const MAX_DATA_POINTS = 20;
const MONITORING_TABLES = ['monitoring_data_202009', 'monitoring_data_202010'] as const;

export function useMonitoringData(
  board: number,
  port: number,
  interval: IntervalType,
  startDate?: Date,
  endDate?: Date
) {
  const [data, setData] = useState<MonitoringData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const viewName = (() => {
      switch (interval) {
        case IntervalType.Minute:      return 'v_timeline_minute';
        case IntervalType.FiveMinutes: return 'v_timeline_5min';
        case IntervalType.Hour:        return 'v_timeline_hour';
        case IntervalType.Day:         return 'v_timeline_day';
        case IntervalType.Week:        return 'v_timeline_week';
        default:                       return 'v_timeline_minute';
      }
    })();

    const fetchInitialData = async () => {
      try {
        let query = supabase
          .from(viewName)
          .select('bucket, total_shots, average_shot_time, board, port')
          .eq('board', board)
          .eq('port', port)
          .order('bucket', { ascending: false });

        if (startDate) {
          query = query.gte('bucket', startDate.toISOString());
        }
        if (endDate) {
          query = query.lte('bucket', endDate.toISOString());
        }

        const limit =
          interval === IntervalType.Day || interval === IntervalType.Week
            ? 100
            : MAX_DATA_POINTS;

        query = query.limit(limit);

        const { data: initialData, error: fetchError } = await query;
        if (fetchError) throw fetchError;

        const transformedData = (initialData || [])
          .map((item: any, idx: number) => ({
            id: idx,
            shot_time: Number(item.average_shot_time),
            timestamp: item.bucket,
            board: item.board,
            port: item.port,
            mac_address: '',
            total_shots: item.total_shots,
          }))
          .sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

        if (transformedData.length > 0) {
          console.log(interval, transformedData.length, transformedData[0], transformedData.at(-1));
        }

        setData(transformedData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch monitoring data'
        );
      } finally {
        setIsLoading(false);
      }
    };

    const subscribeToChangesForRawTables = (
      board: number,
      port: number,
      setData: React.Dispatch<React.SetStateAction<MonitoringData[]>>
    ) => {
      const handleRealtimeInsert = (payload: { new: MonitoringData }) => {
        setData((currentData) => {
          const newDataPoint = {
            ...payload.new,
            shot_time: Number(payload.new.shot_time),
          };
          const updatedData = [...currentData, newDataPoint];
          return updatedData.slice(-MAX_DATA_POINTS);
        });
      };

      const channels: ReturnType<typeof supabase.channel>[] = [];
      for (const table of MONITORING_TABLES) {
        const channel = supabase
          .channel(`monitoring-changes-${table}-${board}-${port}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table,
              filter: `board=eq.${board}&port=eq.${port}`,
            },
            handleRealtimeInsert
          )
          .subscribe();
        channels.push(channel);
      }
      return channels;
    };

    const channels =
      interval === IntervalType.Minute
        ? subscribeToChangesForRawTables(board, port, setData)
        : [];

    fetchInitialData();

    return () => {
      for (const ch of channels) {
        supabase.removeChannel(ch);
      }
    };
  }, [board, port, interval, startDate, endDate]);

  return { data, error, isLoading };
}

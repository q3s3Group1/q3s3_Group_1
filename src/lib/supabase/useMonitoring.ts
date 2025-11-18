import { useState, useEffect } from 'react';
import { supabase } from './client';
import { MonitoringData } from '@/types/supabase';

const MAX_DATA_POINTS = 20;
const MONITORING_TABLES = ['monitoring_data_202009', 'monitoring_data_202010'] as const;

export function useMonitoringData(board: number, port: number) {
  const [data, setData] = useState<MonitoringData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data: initialData, error: fetchError } = await supabase
          .from('v_monitoring_data')
          .select('id, shot_time, timestamp, board, port, mac_address')
          .eq('board', board)
          .eq('port', port)
          .order('timestamp', { ascending: false })
          .limit(MAX_DATA_POINTS);

        if (fetchError) throw fetchError;

        const transformedData = (initialData || [])
          .map((item) => ({
            ...item,
            shot_time: Number(item.shot_time),
          }))
          .sort(
            (a, b) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );

        setData(transformedData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch monitoring data'
        );
      } finally {
        setIsLoading(false);
      }
    };

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

    const subscribeToChanges = () => {
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

    fetchInitialData();
    const channels = subscribeToChanges();

    return () => {
      for (const channel of channels) {
        supabase.removeChannel(channel);
      }
    };
  }, [board, port]);

  return { data, error, isLoading };
}
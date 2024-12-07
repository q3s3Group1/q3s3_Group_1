import { useState, useEffect } from 'react';
import { supabase } from './client';
import { MonitoringData } from '@/types/supabase';

const MAX_DATA_POINTS = 20;

export function useMonitoringData(board: number, port: number) {
  const [data, setData] = useState<MonitoringData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data: initialData, error: fetchError } = await supabase
          .from('monitoring_data_202009')
          .select('id, shot_time, timestamp, board, port, mac_address')
          .eq('board', board)
          .eq('port', port)
          .order('timestamp', { ascending: true })
          .limit(MAX_DATA_POINTS);

        if (fetchError) throw fetchError;
        
        const transformedData = (initialData || []).map(item => ({
          ...item,
          shot_time: Number(item.shot_time),
          mac_address: item.mac_address,
        }));
        
        setData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch monitoring data');
      } finally {
        setIsLoading(false);
      }
    };

    const subscribeToChanges = () => {
      return supabase.channel(`monitoring-changes-${board}-${port}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'monitoring_data_202009',
            filter: `board=eq.${board}&port=eq.${port}`,
          },
          (payload) => {
            setData(currentData => {
              const newDataPoint = {
                ...payload.new as MonitoringData,
                shot_time: Number(payload.new.shot_time),
              };
              const updatedData = [...currentData, newDataPoint];
              return updatedData.slice(-MAX_DATA_POINTS);
            });
          }
        )
        .subscribe();
    };

    fetchInitialData();
    const channel = subscribeToChanges();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [board, port]);

  return { data, error, isLoading };
}
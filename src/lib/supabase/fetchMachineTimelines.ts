import { supabase } from './client';
import { MachineTimeline } from '../../types/supabase';
import { IntervalType } from '@/types/enum';

export const fetchChartData = async (
  board: number,
  port: number,
  startDate: Date,
  endDate: Date,
  interval: IntervalType,
  realtime = false
): Promise<MachineTimeline[]> => {
  let normalizedStart = new Date(startDate);
  let normalizedEnd = new Date(endDate);

  normalizedStart = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));

  if (!realtime) {
    // Normalize startDate and endDate to midnight UTC
   normalizedEnd = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 0, 0, 0));

  } else {
    normalizedEnd = new Date(Date.now() + 1 * 60 * 60 * 1000);
  }

  // Call the Supabase stored procedure
  const { data, error } = await supabase.rpc('get_monitoring_intervals', {
    board_input: board,
    port_input: port,
    start_date: normalizedStart.toISOString(),
    end_date: normalizedEnd.toISOString(),
    interval_input: interval,
  });

  // Log response for debugging
  console.log('fetchChartData', { data, error });

  if (error) {
    throw new Error(`Error fetching chart data: ${error.message}`);
  }

  return data || [];
};


// fetch realtime timeline
export const fetchRealtimeData = async (
  board: number,
  port: number
): Promise<MachineTimeline[]> => {
  

  // start date, 12 hours ago
  const startDate = new Date(Date.now() - 12 * 60 * 60 * 1000);

  // end date, now
  const endDate = new Date(Date.now() + 1 * 60 * 60 * 1000);



    const interval = IntervalType.Hour;
    // Call the Supabase stored procedure
    const { data, error } = await supabase.rpc('get_monitoring_intervals', {
      board_input: board,
      port_input: port,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      interval_input: interval,
    });
  
    // Log response for debugging
    console.log('fetchChartData', { data, error });
  
    if (error) {
      throw new Error(`Error fetching chart data: ${error.message}`);
    }
  
    return data || [];
};

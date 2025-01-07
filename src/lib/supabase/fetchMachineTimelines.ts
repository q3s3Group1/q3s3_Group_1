import { supabase } from './client';
import { MachineTimeline } from '../../types/supabase';
import { IntervalType } from '@/types/enum';

export const fetchChartData = async (
  board: number,
  port: number,
  startDate: Date,
  endDate: Date,
  interval: IntervalType
): Promise<MachineTimeline[]> => {
  // Normalize startDate and endDate to midnight UTC
  const normalizedStart = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
  const normalizedEnd = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate(), 0, 0, 0));



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

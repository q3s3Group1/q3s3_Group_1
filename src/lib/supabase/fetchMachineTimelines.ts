import { supabase } from './client';
import { MachineTimeline } from '../../types/supabase';
import { IntervalType } from '@/types/enum';

// helpers for utc 
const utcStartOfDay = (d: Date) =>
  new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0));

const utcNextMidnight = (d: Date) =>
  new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0));


export const fetchChartData = async (
  board: number,
  port: number,
  startDate: Date,
  endDate: Date,
  interval: IntervalType,
  realtime = false
): Promise<MachineTimeline[]> => {

  let normalizedStart = utcStartOfDay(startDate);
  let normalizedEnd: Date = utcNextMidnight(endDate);


if (!realtime) {
  // half-open window: [start, end)
  let normalizedEnd = utcNextMidnight(endDate);

} else {

  let normalizedEnd = new Date(Date.now() + 1 * 60 * 60 * 1000);
}


  const { data, error } = await supabase.rpc('get_monitoring_intervals', {
    board_input: board,
    port_input: port,
    start_date: normalizedStart.toISOString(),
    end_date: normalizedEnd.toISOString(),
    interval_input: interval,
  });

  if (error) {
    throw new Error(`Error fetching chart data: ${error.message}`);
  }

  return data || [];
};

export const fetchRealtimeData = async (
  board: number,
  port: number
): Promise<MachineTimeline[]> => {
  const startDate = new Date(Date.now() - 12 * 60 * 60 * 1000);
  const endDate = new Date(Date.now() + 1 * 60 * 60 * 1000);
  const interval = IntervalType.Hour;

  const { data, error } = await supabase.rpc('get_monitoring_intervals', {
    board_input: board,
    port_input: port,
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
    interval_input: interval,
  });

  if (error) {
    throw new Error(`Error fetching chart data: ${error.message}`);
  }

  return data || [];
};

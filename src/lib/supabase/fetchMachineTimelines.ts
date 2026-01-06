import { supabase } from './client';
import { MachineTimeline } from '../../types/supabase';
import { IntervalType } from '@/types/enum';

const HOUR_IN_MS = 60 * 60 * 1000;

const utcStartOfDay = (d: Date) =>
  new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0));

const utcNextMidnight = (d: Date) =>
  new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0));

const resolveViewName = (interval: IntervalType): string => {
  switch (interval) {
    case IntervalType.Minute:
      return 'v_timeline_minute';
    case IntervalType.FiveMinutes:
      return 'v_timeline_5min';
    case IntervalType.Hour:
      return 'v_timeline_hour';
    case IntervalType.Day:
      return 'v_timeline_day';
    case IntervalType.Week:
      return 'v_timeline_week';
    default:
      return 'v_timeline_minute';
  }
};

export const fetchChartData = async (
  board: number,
  port: number,
  startDate: Date,
  endDate: Date,
  interval: IntervalType,
  realtime = false
): Promise<MachineTimeline[]> => {
  const normalizedStart = realtime ? startDate : utcStartOfDay(startDate);
  const normalizedEnd = realtime
    ? new Date(Date.now() + HOUR_IN_MS)
    : utcNextMidnight(endDate);


  const viewName = resolveViewName(interval);

  let query = supabase
    .from(viewName)
    .select('bucket, total_shots, average_shot_time, board, port')
    .eq('board', board)
    .eq('port', port)
    .gte('bucket', normalizedStart.toISOString())
    .lte('bucket', normalizedEnd.toISOString())
    .order('bucket', { ascending: true });

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error fetching chart data: ${error.message}`);
  }

  return (data || []).map((item: any) => ({
    truncated_timestamp: item.bucket,
    total_shots: item.total_shots,
    average_shot_time: Number(item.average_shot_time),
  }));
};

export const fetchRealtimeData = async (
  board: number,
  port: number
): Promise<MachineTimeline[]> => {
  const startDate = new Date(Date.now() - 12 * HOUR_IN_MS);
  const endDate = new Date(Date.now() + HOUR_IN_MS);

  // reuse main function, just with realtime = true & hourly buckets
  return fetchChartData(
    board,
    port,
    startDate,
    endDate,
    IntervalType.Hour,
    true
  );
};

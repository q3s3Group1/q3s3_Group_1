import { supabase } from './client';
import { Machine, Mold, MoldHistory } from '../../types/supabase';

/**
 * Fetch all machines
 */
// with machine id as parameter
export const fetchMoldsByDateRange = async (startDate: Date, endDate: Date, board: number, port: number): Promise<MoldHistory[]> => {
  const startDateString = startDate.toISOString().split('T')[0];
  const endDateString = endDate.toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('mv_molds_history')
    .select('*')
    .gte('start_date', startDateString) // Greater than or equal to startDate
    .lte('end_date', endDateString) // Less than or equal to endDate
    .eq('board', board)
    .eq('port', port); // Less than or equal to endDate

  if (error) {
    throw new Error(`Error fetching molds between ${startDate} and ${endDate}: ${error.message}`);
  }

  return data || [];
};

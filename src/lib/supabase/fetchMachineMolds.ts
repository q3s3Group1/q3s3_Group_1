import { supabase } from './client';
import { Mold } from '../../types/supabase';

/**
 * Fetch all machines
 */
// with machine id as parameter
export const fetchMachineMolds = async (machine_id: number): Promise<Mold[]> => {
  const { data, error } = await supabase
    .from('v_molds')
    .select('*')
    .eq('current_machine_id', machine_id);

  if (error) {
    throw new Error(`Error fetching machine timelines: ${error.message}`);
  }

  return data || [];
};

import { supabase } from './client';
import { Machine } from '../../types/supabase';

/**
 * Fetch all machines
 */
export const fetchMachines = async (): Promise<Machine[]> => {
  const { data, error } = await supabase
    .from('v_machine_status')
    .select('*')
    .order('status', { ascending: false });

  if (error) {
    throw new Error(`Error fetching machine timelines: ${error.message}`);
  }

  return data || [];
};

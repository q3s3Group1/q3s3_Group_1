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


// fetch specific machine
export const fetchMachine = async (machine_id: string): Promise<Machine> => {
  const { data, error } = await supabase
    .from('v_machine_status')
    .select('*')
    .eq('machine_id', machine_id)
    .single();

  if (error) {
    throw new Error(`Error fetching machine: ${error.message}`);
  }

  return data;
};
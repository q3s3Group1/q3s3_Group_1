import { Milestone } from '@/types/supabase';
import { supabase } from './client';

/**
 * Fetch all machines
 */
// with machine id as parameter
export const fetchMilestones = async (): Promise<Milestone[]> => {
  const { data, error } = await supabase
    .from('i_mold_maintenance_milestones')
    .select('*');

  if (error) {
    throw new Error(`Error fetching machine timelines: ${error.message}`);
  }

  return data || [];
};

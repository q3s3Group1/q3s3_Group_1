import { supabase } from './client';
import { Mold } from '../../types/supabase';

/**
 * Fetch all machines
 */
// with machine id as parameter
export const fetchMolds = async (): Promise<Mold[]> => {
  const { data, error } = await supabase
    .from('v_molds')
    .select('*');

  if (error) {
    throw new Error(`Error fetching machine timelines: ${error.message}`);
  }

  return data || [];
};

export const fetchAllMolds = async (): Promise<Mold[]> => {
    const { data, error } = await supabase
      .from('v_all_molds').select('*');
  
    if (error) {
      throw new Error(`Error fetching machine timelines: ${error.message}`);
    }
  
    return data || [];
  };
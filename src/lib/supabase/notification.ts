import { supabase } from './client';
import { Notification } from '@/types/supabase';

export const fetchNotifications = async (): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('i_notifications')
    .select('*');

  if (error) {
    throw new Error(`Error fetching machine timelines: ${error.message}`);
  }

  return data || [];
};

import { supabase } from './client';
import { Notification } from '@/types/supabase';

export const fetchNotifications = async (): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('v_notifications')
    .select('*');

  if (error) {
    throw new Error(`Error fetching machine timelines: ${error.message}`);
  }

  return data || [];
};


export const fetchNotificationsByMachineId = async (machine_id: number): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('v_notifications')
    .select('*')
    .eq('machine_id', machine_id);

  if (error) {
    throw new Error(`Error fetching machine timelines: ${error.message}`);
  }

  return data || [];
};

export const fetchNotificationsByMoldId = async (mold_id: number): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('v_notifications')
    .select('*')
    .eq('mold_id', mold_id);

  if (error) {
    throw new Error(`Error fetching machine timelines: ${error.message}`);
  }

  return data || [];
};

// Mark as read
export const markAsRead = async (id: number) => {
  const { error } = await supabase
    .from('i_notifications')
    .update({ read_at: new Date() })
    .eq('id', id);

    // log response
    console.log('markAsRead', { error });

  if (error) {
    throw new Error(`Error marking notification as read: ${error.message}`);
  }
};
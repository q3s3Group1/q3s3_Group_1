// lib/supabase/fetchMachines.ts
import { supabase } from './client';
import type { Machine } from '../../types/supabase';

const toRefTs = (d?: Date | string) =>
  d ? (typeof d === 'string' ? d : d.toISOString()) : undefined;

export const fetchMachines = async (refTs?: Date | string): Promise<Machine[]> => {
  const ref = toRefTs(refTs);

  if (ref) {
    const { data, error } = await supabase
      .rpc('v_machine_activity_at', { p_ref_ts: ref });

    if (error) throw new Error(`Error fetching machines: ${error.message}`);
    return (data as Machine[]) ?? [];
  }

  const { data, error } = await supabase
    .from('v_machine_activity')
    .select('*')
    .order('status', { ascending: false })
    .order('machine_name', { ascending: true, nullsFirst: false });

  if (error) throw new Error(`Error fetching machines: ${error.message}`);
  return (data as Machine[]) ?? [];
};

export const fetchMachine = async (
  machine_id: string | number,
  refTs?: Date | string
): Promise<Machine> => {
  const ref = toRefTs(refTs);

  if (ref) {
    const { data, error } = await supabase.rpc('v_machine_activity_one', {
      p_ref_ts: ref,
      p_machine_id: machine_id,
    });
    if (error) throw new Error(`Error fetching machine: ${error.message}`);
    if (!data || data.length === 0) throw new Error('Machine not found');
    return data[0] as Machine;
  }

  const { data, error } = await supabase
    .from('v_machine_activity')
    .select('*')
    .eq('machine_id', machine_id)
    .maybeSingle(); // biztonságosabb, mint .single()

  if (error) throw new Error(`Error fetching machine: ${error.message}`);
  if (!data) throw new Error('Machine not found');
  return data as Machine;
};

export const dynamic = 'force-dynamic';

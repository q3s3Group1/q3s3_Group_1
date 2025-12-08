// lib/supabase/fetchMachines.ts
import { supabase } from './client';
import type { Machine } from '../../types/supabase';

type RawMachineStatus = {
  machine_id: number;
  machine_name: string | null;
  board: number;
  port: number;
  status: string | null;
  total_shots: number | null;
  avg_shot_time: number | null;
  last_update: string | null;
  time_since_last_shot_seconds?: number | null;
};

type MachineMetadata = {
  id: number;
  name: string | null;
  board: number;
  port: number;
};

const STATUS_MAP: Record<string, Machine['status']> = {
  actief: 'operational',
  active: 'operational',
  operational: 'operational',
  standby: 'standby',
  idle: 'idle',
  inactief: 'idle',
  stilstand: 'inactive',
  offline: 'inactive',
};

const toRefTs = (d?: Date | string) => {
  if (!d) return undefined;
  return typeof d === 'string' ? d : d.toISOString();
};

const SIMULATED_NOW = new Date('2020-09-17T23:59:59Z').getTime();

const formatTimeSince = (lastUpdate: string | null): string | null => {
  if (!lastUpdate) return null;
  const timestamp = new Date(lastUpdate).getTime();
  if (Number.isNaN(timestamp)) return null;

  const diffSeconds = Math.max(0, Math.floor(((Number.isNaN(SIMULATED_NOW) ? Date.now() : SIMULATED_NOW) - timestamp) / 1000));
  const hours = Math.floor(diffSeconds / 3600);
  const minutes = Math.floor((diffSeconds % 3600) / 60);
  const seconds = diffSeconds % 60;

  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

const mapMachineStatus = (machine: RawMachineStatus): Machine => {
  let computedSeconds: number | null = null;
  if (typeof machine.time_since_last_shot_seconds === 'number') {
    computedSeconds = machine.time_since_last_shot_seconds;
  } else if (machine.last_update) {
    const simulatedNow = Number.isNaN(SIMULATED_NOW) ? Date.now() : SIMULATED_NOW;
    computedSeconds = Math.max(
      0,
      Math.floor((simulatedNow - new Date(machine.last_update).getTime()) / 1000)
    );
  }

  const derivedStatus = (() => {
    if (computedSeconds == null) return 'inactive';
    if (computedSeconds <= 24 * 60 * 60) return 'operational';
    return 'inactive';
  })();

  return {
    machine_id: machine.machine_id,
    machine_name: machine.machine_name,
    board: machine.board,
    port: machine.port,
    mold_name: null,
    last_ts: machine.last_update,
    time_since_last_shot: formatTimeSince(machine.last_update),
    status:
      derivedStatus ??
      (STATUS_MAP[machine.status?.toLowerCase() ?? ''] ?? 'inactive'),
    total_shots: machine.total_shots ?? 0,
    avg_shot_time: machine.avg_shot_time ?? 0,
  };
};

const mapMetadataMachine = (machine: MachineMetadata): Machine => ({
  machine_id: machine.id,
  machine_name: machine.name,
  board: machine.board,
  port: machine.port,
  mold_name: null,
  last_ts: null,
  time_since_last_shot: null,
  status: 'inactive',
  total_shots: 0,
  avg_shot_time: 0,
});

const fetchFallbackMachines = async (): Promise<Machine[]> => {
  const { data, error } = await supabase
    .from('machine_monitoring_poorten')
    .select('id, name, board, port')
    .eq('visible', true)
    .order('id');

  if (error) throw new Error(`Error fetching fallback machines: ${error.message}`);
  return (data as MachineMetadata[] | null)?.map(mapMetadataMachine) ?? [];
};

export const fetchMachines = async (refTs?: Date | string): Promise<Machine[]> => {
  const ref = toRefTs(refTs);

  if (ref) {
    const { data, error } = await supabase
      .rpc('v_machine_activity_at', { p_ref_ts: ref });

    if (error) throw new Error(`Error fetching machines: ${error.message}`);
    return (data as Machine[]) ?? [];
  }

  try {
    const { data, error } = await supabase
      .from('mv_machine_status')
      .select('*')
      .order('status', { ascending: false })
      .order('machine_name', { ascending: true, nullsFirst: false });

    if (error) throw error;
    return (data as RawMachineStatus[] | null)?.map(mapMachineStatus) ?? [];
  } catch (error) {
    if (error instanceof Error && error.message.includes('statement timeout')) {
      return fetchFallbackMachines();
    }
    throw new Error(`Error fetching machines: ${(error as Error).message}`);
  }
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

  try {
    const { data, error } = await supabase
      .from('mv_machine_status')
      .select('*')
      .eq('machine_id', machine_id)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Machine not found');
    return mapMachineStatus(data as RawMachineStatus);
  } catch (error) {
    if (error instanceof Error && error.message.includes('statement timeout')) {
      const fallback = await fetchFallbackMachines();
      const machine = fallback.find((m) => m.machine_id === Number(machine_id));
      if (machine) return machine;
      throw new Error('Machine not found');
    }
    throw new Error(`Error fetching machine: ${(error as Error).message}`);
  }
};

export const dynamic = 'force-dynamic';

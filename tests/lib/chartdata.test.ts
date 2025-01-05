import { IntervalType } from '@/components/SelectInterval';
import { MachineTimeline } from '@/types/supabase';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export const fetchChartData = async (
    board: number,
    port: number,
    startDate: Date,
    endDate: Date,
    interval: IntervalType
): Promise<MachineTimeline[]> => {


    const { data, error } = await supabase.rpc('get_monitoring_intervals', {
        board_input: board,
        port_input: port,
        start_date: startDate,
        end_date: endDate,
        interval_input: interval,
    });


    if (error) {
        throw new Error(`Error fetching chart data: ${error.message}`);
    }

    return data || [];
};

test('calls a Supabase RPC', async () => {
  const board = 1;
    const port = 1;
    const startDate = new Date(2020, 8, 20);
    const endDate = new Date(2020, 8, 21);

    const interval = IntervalType.Hour;

    const response = fetchChartData(board, port, startDate, endDate, interval);

    await expect(response).resolves.toEqual([]);
});

import { supabase } from './client';
import { MachineTimeline } from '../../types/supabase';
import { IntervalType } from '@/types/enum';


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

    // log response
    console.log('fetchChartData', { data, error });

    if (error) {
        throw new Error(`Error fetching chart data: ${error.message}`);
    }

    return data || [];
};

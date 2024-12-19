import {supabase} from './client';
import {MoldHistory} from '../../types/supabase';

// with board and port as parameter
export const fetchMoldHistoryByBoardPort = async (board: number, port: number): Promise<MoldHistory[]> => {
    const {data, error} = await supabase
        .from('mv_molds_history')
        .select('*')
        .eq('board', board)
        .eq('port', port);

    if (error) {
        throw new Error(`Error fetching machine timelines: ${error.message}`);
    }

    return data || [];
};

// with mold id as parameter
export const fetchMoldHistoryByMoldId = async (mold_id: number): Promise<MoldHistory[]> => {
    const {data, error} = await supabase
        .from('mv_molds_history')
        .select('*')
        .eq('mold_id', mold_id);

    if (error) {
        throw new Error(`Error fetching machine timelines: ${error.message}`);
    }

    return data || [];
}
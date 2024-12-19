import {supabase} from './client';
import {Mold, MoldMaintenance} from '../../types/supabase';

/**
 * Fetch all machines
 */
// with machine id as parameter
export const fetchMolds = async (): Promise<MoldMaintenance[]> => {
    const {data, error} = await supabase
        .from('v_molds_with_maintenance')
        .select('*');

    if (error) {
        throw new Error(`Error fetching machine timelines: ${error.message}`);
    }

    return data || [];
};


export const fetchAllMolds = async (): Promise<Mold[]> => {
    const {data, error} = await supabase
        .from('v_molds').select('*');

    if (error) {
        throw new Error(`Error fetching machine timelines: ${error.message}`);
    }

    const filtered: Mold[] = []
    data?.forEach((v) => {
        if (!filtered.includes(v)) {
            filtered.push(v)
        }
    })

    return filtered || [];
};

// fetch mold by id
export const fetchMold = async (id: number): Promise<Mold> => {
    const {data, error} = await supabase
        .from('v_molds')
        .select('*')
        .eq('mold_id', id);



    if (error) {
        throw new Error(`Error fetching machine timelines: ${error.message}`);
    }

    const filtered: Mold[] = []
    data?.forEach((v) => {
        if (!filtered.includes(v)) {
            filtered.push(v)
        }
    })

    return filtered[0] || [];
};
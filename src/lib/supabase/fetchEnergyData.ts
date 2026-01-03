import {EnergyKPI} from "@/types/supabase";
import {supabase} from "@/lib/supabase/client";
import {IntervalType} from "@/types/enum";



const energySupported = (interval: IntervalType) =>
    interval === IntervalType.Hour ||
    interval === IntervalType.Day ||
    interval === IntervalType.Week;



export async function fetchEnergyData(
    board: number,
    port: number,
    start: Date,
    end: Date,
    interval: IntervalType
): Promise<EnergyKPI[]> {
    if (!energySupported(interval)) return [];

    const { data, error } = await supabase
        .from("v_energy_kpi_fast")
        .select("*")
        .eq("board", board)
        .eq("port", port)
        .gte("start_timestamp", start.toISOString())
        .lte("end_timestamp", end.toISOString())
        .order("start_timestamp");

    if (error) throw error;

    return (data ?? []).map(d => ({
        ...d,
        start_timestamp: new Date(d.start_timestamp),
        end_timestamp: new Date(d.end_timestamp),
    }));
}


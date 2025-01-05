"use client";
import { MachineTimeline, Notification, NotificationStatus } from "@/types/supabase";
import { getNotificationColor, getNotificationHex } from "./util";
import { fetchChartData } from "@/lib/supabase/fetchMachineTimelines";
import { useEffect, useState } from "react";
import { addDays } from "date-fns";
import { IntervalType } from "@/types/enum";

import TimelineChart from "@/components/timeline/TimelineChart";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface NotificationItemProps {
    notification: Notification;
    onClick?: () => void;
}



export default function NotificationItem({ notification, onClick }: NotificationItemProps) {
    const [chartData, setChartData] = useState<MachineTimeline[]>([]);

    const startDate = new Date(notification.detected_at);

    const endDate = addDays(startDate, 1);


    useEffect(() => {
        const loadData = async () => {
        if (notification.board && notification.port) {

            const data = await fetchChartData(notification.board, notification.port, startDate, endDate, IntervalType.Hour);
            setChartData(data);
        }
        };

        loadData();
    }, [notification]);

    const lineColor = getNotificationHex(notification);

    
    return (
        <div className={`flex items-center p-4 rounded-lg shadow-md relative overflow-hidden border-l-8 cursor-pointer ${getNotificationColor(notification)} hover:border-opacity-80 transition-colors duration-300 hover:shadow-lg`}
        onClick={
            onClick
        }
            >
            <div className="relative z-20 w-full">
            <div className={notification.read_at ? "opacity-50" : ""}>
                <Badge color="blue" className="absolute top-2 right-2">{notification.board} - {notification.port}</Badge>
                <div className="flex flex-col">
                    {/* Mold_id, machine_id */}
                    <span className="text-sm">
                        <Link href={`/dashboard/machines/${notification.machine_id}`}>
                               Machine {notification.machine_id}
                        </Link>

                        <span className="mx-1">-</span>


                        <Link href={`/dashboard/molds/${notification.mold_id}`}>
                               Matrijs {notification.mold_id}
                        </Link>
                    </span>
                <h3 className="text-lg font-semibold">{notification.message}</h3>
                <p className="text-sm">{
                    new Date(notification.detected_at).toLocaleString('nl-NL')
                    }</p>
                </div>
            </div>
            </div>

            <div className="absolute top-0 right-0 bottom-0 w-full bg-gradient-to-l from-transparent to-white opacity-50 z-10
            "></div>

            <div className="absolute top-0 right-0 bottom-0 w-full z-0 opacity-50">
            <TimelineChart data={chartData} interval={IntervalType.Hour} hideAxis hideTooltip lineColor={lineColor} />

            </div>

        </div>
    );
}
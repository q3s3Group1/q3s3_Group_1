"use client";
import { MachineTimeline, Notification, NotificationStatus } from "@/types/supabase";
import { getNotificationColor, getNotificationHex } from "./util";
import { fetchChartData } from "@/lib/supabase/fetchMachineTimelines";
import { useEffect, useState } from "react";
import { addDays } from "date-fns";
import { IntervalType } from "@/components/SelectInterval";
import TimelineChart from "@/components/timeline/TimelineChart";
import { Badge } from "@/components/ui/badge";

interface NotificationItemProps {
    notification: Notification;
}



export default function NotificationItem({ notification }: NotificationItemProps) {
    const [chartData, setChartData] = useState<MachineTimeline[]>([]);

    const startDate = new Date(notification.detected_at);

    const endDate = addDays(startDate, 1);


    useEffect(() => {
        const loadData = async () => {
            const data = await fetchChartData(notification.board, notification.port, startDate, endDate, IntervalType.Hour);
            setChartData(data);
        };

        loadData();
    }, [notification]);

    const lineColor = getNotificationHex(notification);

    
    return (
        <div className={`flex items-center p-4 rounded-lg shadow-md relative overflow-hidden border-l-8 cursor-pointer ${getNotificationColor(notification)} hover:border-opacity-80 transition-colors duration-300 hover:shadow-lg`}>
            <div className={notification.read_at ? "opacity-50" : ""}>
                <Badge color="blue" className="absolute top-2 right-2">{notification.board} - {notification.port}</Badge>
                <h3 className="text-lg font-semibold">{notification.message}</h3>
                <p className="text-sm">{notification.detected_at.toLocaleString(
                    "nl-NL",
                )}</p>
            </div>

            <div className="absolute top-0 right-0 bottom-0 w-full">
            <TimelineChart data={chartData} interval={IntervalType.Hour} hideAxis hideTooltip lineColor={lineColor} />

            </div>

        </div>
    );
}
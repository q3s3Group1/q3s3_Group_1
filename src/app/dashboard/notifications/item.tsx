"use client";
import { Notification, NotificationStatus } from "@/types/supabase";

interface NotificationItemProps {
    notification: Notification;
}

// Function to convert enum to color
function getNotificationColor(notification: Notification) {
    const type = notification.status;

    var color = "border-gray-500";
    switch (type) {
        case NotificationStatus.offline:
            color = "border-red-500";
            break;
        case NotificationStatus.online:
            color = "border-green-500";
            break;
        case NotificationStatus.error:
            color = "border-red-500";
            break;

        case NotificationStatus.maintenance:
            color = "border-yellow-500";
            break;

        case NotificationStatus.milestone:
            color = "border-blue-500";
            break;

        default:
            color = "border-gray-500";
            break;
    }

    // If notification.read border opacity 50
    if (notification.read_at) {
        color += " border-opacity-50";
    }

    return color;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
    return (
        <div className={`flex items-center p-4 rounded-lg shadow-md relative overflow-hidden border-l-8 cursor-pointer ${getNotificationColor(notification)} hover:border-opacity-80 transition-colors duration-300 hover:shadow-lg`}>
            <div className={notification.read_at ? "opacity-50" : ""}>
                <h3 className="text-lg font-semibold">{notification.message}</h3>
                <p className="text-sm">{notification.detected_at.toLocaleString(
                    "nl-NL",
                )}</p>
            </div>
        </div>
    );
}
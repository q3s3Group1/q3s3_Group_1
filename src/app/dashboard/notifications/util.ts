import { Notification, NotificationStatus } from "@/types/supabase";


export function getNotificationColor(notification: Notification) {
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

// get notification hex
export function getNotificationHex(notification: Notification) {
    const type = notification.status;

    var color = "#000000";
    switch (type) {
        case NotificationStatus.offline:
            color = "#FF0000";
            break;
        case NotificationStatus.online:
            color = "#5ec269";
            break;
        case NotificationStatus.error:
            color = "#FF0000";
            break;

        case NotificationStatus.maintenance:
            color = "#FFFF00";
            break;

        case NotificationStatus.milestone:
            color = "#0000FF";
            break;

        default:
            color = "#000000";
            break;
    }

    return color;
}
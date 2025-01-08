"use client";
import { Notification } from "@/types/supabase";

import NotificationItem from "./item";
import { useEffect, useState } from "react";
import { markAsRead } from "@/lib/supabase/notification";
import { Tabs } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";




interface NotificationTabsProps {
    notifications: Notification[];
}

export default function NotificationTabs(props: NotificationTabsProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        // filter out the read & resolved notifications
        setNotifications(props.notifications.filter((notification) => !notification.read_at && !notification.resolved_at));
    }
    , [props.notifications]);

    // mark as read and remove notification
    const markAsReadN = async (id: number) => {
        await markAsRead(id);
        setNotifications(notifications.filter((notification) => notification.id !== id));
    };


    return (
        <>
        {props.notifications.length === 0 ? (
            <p>No notifications found</p>
        ) : (
            <div>
                
                    <div className="flex space-x-4 p-4">
                    <Button onClick={() => setNotifications(props.notifications.filter((notification) => !notification.read_at && !notification.resolved_at))}>Unread</Button>
                    
                    <Button onClick={() => setNotifications(props.notifications.filter((notification) => !notification.resolved_at))}>Unresolved</Button>
                    <Button onClick={() => setNotifications(props.notifications.filter((notification) => notification.resolved_at))}>Resolved</Button>
                    {/* Unread and unresolved */}
                    <Button onClick={() => setNotifications(props.notifications)}>All</Button>

                    
                    </div>

                    <div className="w-full p-4">
                    {
                        notifications.length > 0 ? (
                           <div className="grid grid-cols-1 gap-4">
                            {notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} onClick={() => {
                        markAsReadN(notification.id);
                    }} />
                ))}
                           </div>
                        ) : (
                            <p>No notifications found</p>
                        )
                        
                    }
                    </div>
            </div>
        )}</>

            
    );
}
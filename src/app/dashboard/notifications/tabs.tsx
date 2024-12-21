import { Notification } from "@/types/supabase";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import NotificationItem from "./item";

interface NotificationTabsProps {
    notifications: Notification[];
}

export default function NotificationTabs({ notifications }: NotificationTabsProps) {
    return (
        <>
        {notifications.length === 0 ? (
            <p>No notifications found</p>
        ) : (

            <Tabs className="w-full" defaultValue="unread">

        <TabsList className="flex justify-around w-full">
            <TabsTrigger value="unread">Ongelezen</TabsTrigger>
             <TabsTrigger value="all">Alle</TabsTrigger>
             <TabsTrigger value="read">Gelezen</TabsTrigger>
        </TabsList>

        <div className="w-full container mx-auto px-2">
        <TabsContent value="all">
            <ul className="grid gap-4">
                {notifications.map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />  
                ))}
            </ul>
        </TabsContent>

        <TabsContent value="unread">
            <ul className="grid gap-4">
                {notifications.filter((n) => !n.read_at).map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />  
                ))}
            </ul>
        </TabsContent>

        <TabsContent value="read">
            <ul className="grid gap-4">
                {notifications.filter((n) => n.read_at).map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />  
                ))}
            </ul>
        </TabsContent>

        </div>

    </Tabs>
        )}</>

            
    );
}
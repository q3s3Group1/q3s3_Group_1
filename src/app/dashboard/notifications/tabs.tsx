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
           <Tabs className="w-full" defaultValue="all">

                <TabsList className="flex justify-around w-full">
                     <TabsTrigger value="all">Alle</TabsTrigger>
                </TabsList>
    
                <div className="w-full container mx-auto px-2">
                <TabsContent value="all">
                    <ul className="grid gap-4">
                        {notifications.map((notification) => (
                            <NotificationItem key={notification.id} notification={notification} />  
                        ))}
                    </ul>
                </TabsContent>

                </div>

            </Tabs>

            
    );
}
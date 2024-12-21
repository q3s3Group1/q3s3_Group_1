import { fetchNotifications } from "@/lib/supabase/notification";
import Header from "../header";
import NotificationTabs from "./tabs";

export default async function Page() {
    const notifications = await fetchNotifications();

    return (

        <>
            <Header 
                title="Notifications"
                description="Overview of all notifications"
                />

                <NotificationTabs notifications={notifications} />

            
        </>
    );
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client"; 

export function useUnreadNotifCount() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    const fetchCount = async () => {
      const { count, error } = await supabase
        .from("v_notifications")
        .select("*", { head: true, count: "exact" })
        .is("read_at", null); // all unread notifications

      if (error) {
        console.error("Error fetching notification count:", error);
        return;
      }

      if (isMounted && typeof count === "number") {
        setCount(count);
      }
    };

    // initial load
    fetchCount();

    // realtime updates when notifications are inserted/updated
    const channel = supabase
      .channel("notifications-count")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "i_notifications" },
        () => {
          // any change means refresh count
          fetchCount();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return count;
}

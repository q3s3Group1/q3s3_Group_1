"use client";

import { useEffect, useMemo, useState } from "react";
import { Notification } from "@/types/supabase";
import NotificationItem from "./item";
import { markAsRead } from "@/lib/supabase/notification";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NotificationTabsProps {
  notifications: Notification[];
}

type TabType = "unread" | "all";

export default function NotificationTabs({
  notifications: initialNotifications,
}: NotificationTabsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("unread");
  const [selected, setSelected] = useState<Notification | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [markingId, setMarkingId] = useState<number | null>(null);

  // sync initial props (already sorted newest→oldest)
  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  // visible list according to active tab
  const visibleNotifications = useMemo(() => {
    return activeTab === "unread"
      ? notifications.filter((n) => !n.read_at)
      : notifications;
  }, [notifications, activeTab]);

  const handleSelect = (notification: Notification) => {
    setSelected(notification);
    setDialogOpen(true);
  };

  const handleMarkAsRead = async (notification: Notification) => {
  if (notification.read_at || markingId === notification.id) return;

  setMarkingId(notification.id);
  try {
    await markAsRead(notification.id);

    const now = new Date(); // ✅ Date, matches Notification["read_at"]

    // update list
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id ? { ...n, read_at: now } : n
      )
    );

    // update dialog item
    setSelected((prev) =>
      prev && prev.id === notification.id
        ? { ...prev, read_at: now }
        : prev
    );
  } catch (err) {
    console.error("Failed to mark notification as read:", err);
  } finally {
    setMarkingId(null);
  }
};


  if (!initialNotifications.length) {
    return <p className="p-4">No notifications found</p>;
  }

  return (
    <>
      {/* Tabs header */}
      <div className="flex space-x-2 p-4">
        <Button
          variant={activeTab === "unread" ? "default" : "outline"}
          onClick={() => setActiveTab("unread")}
        >
          Unread
        </Button>

        <Button
          variant={activeTab === "all" ? "default" : "outline"}
          onClick={() => setActiveTab("all")}
        >
          All
        </Button>
      </div>

      {/* List */}
      <div className="w-full p-4">
        {visibleNotifications.length ? (
          <div className="grid grid-cols-1 gap-4">
            {visibleNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => handleSelect(notification)}
              />
            ))}
          </div>
        ) : (
          <p>No notifications found</p>
        )}
      </div>

      {/* Details pop-up */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="max-w-xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.message}</DialogTitle>
                <DialogDescription>
                  {new Date(selected.detected_at).toLocaleString("nl-NL")}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-2 text-sm">
                <p>{selected.message}</p>

                <div className="text-xs text-muted-foreground space-y-1">
                  {selected.board && (
                    <p>Board: {selected.board}</p>
                  )}
                  {selected.port && (
                    <p>Port: {selected.port}</p>
                  )}
                  {selected.machine_id && (
                    <p>Machine: {selected.machine_id}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>

                <Button
                  disabled={!!selected.read_at || markingId === selected.id}
                  onClick={() => handleMarkAsRead(selected)}
                >
                  {selected.read_at ? "Already read" : "Mark as read"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

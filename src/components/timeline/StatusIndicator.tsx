"use client";

import { AlertOctagon, PowerIcon, PauseIcon } from "lucide-react";
import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface StatusIndicatorProps {
  status: string;
}

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  const { t } = useLanguage();

  const getStyle = () => {
    switch (status) {
      case "operational":
        return "bg-green-500 border-green-600";
      case "standby":
        return "bg-yellow-500 border-yellow-600";
      case "idle":
        return "bg-orange-500 border-orange-600";
      case "inactive":
        return "bg-gray-500 border-gray-600";
      case "failure":
        return "bg-red-600 border-red-700";
      default:
        return "bg-gray-400 border-gray-500";
    }
  };

  const getIcon = (classname: string) => {
    switch (status) {
      case "operational":
        return <PowerIcon className={classname} />;

      case "standby":
      case "idle":
        return <PauseIcon className={classname} />;

      case "failure":
        return <AlertOctagon className={classname} />;

      case "inactive":
      default:
        return <AlertOctagon className={classname} />;
    }
  };

  return (
    <div
      className={`w-6 h-6 rounded-full border flex justify-center items-center ${getStyle()}`}
      aria-label={t(`status.${status}`)}
      title={t(`status.${status}`)}
    >
      {getIcon("size-4 text-white")}
    </div>
  );
}

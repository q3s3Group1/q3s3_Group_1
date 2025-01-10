"use client";
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Machine, MachineTimeline, Mold, MoldHistory } from "@/types/supabase";

interface MachineCardProps {
  machine: Machine;
  molds?: MoldHistory[];
  chartData?: MachineTimeline[];
}

export default function MachineCard({ machine, molds, chartData = [] }: MachineCardProps) {
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [isMoldsLoading, setIsMoldsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state for chart data and molds
    const chartTimeout = setTimeout(() => setIsChartLoading(false), 500); // Adjust delay as needed
    const moldsTimeout = setTimeout(() => setIsMoldsLoading(false), 500);

    return () => {
      clearTimeout(chartTimeout);
      clearTimeout(moldsTimeout);
    };
  }, [chartData, molds]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actief":
        return "bg-green-500";
      case "Inactief":
        return "bg-yellow-500";
      case "Stilstand":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusHex = (status: string) => {
    switch (status) {
      case "Actief":
        return "#10B981";
      case "Inactief":
        return "#F59E0B";
      case "Stilstand":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Actief":
        return "bg-green-900/50 text-green-300 border border-green-700";
      case "Inactief":
        return "bg-yellow-900/50 text-yellow-300 border border-yellow-700";
      case "Stilstand":
        return "bg-red-900/50 text-red-300 border border-red-700";
      default:
        return "bg-gray-900/50 text-gray-300 border border-gray-700";
    }
  };

  const getStatus = (machine: Machine) => {
    return machine.status || "Onbekend";
  };

  const medianHourlyShots =
    chartData.length > 0
      ? chartData.reduce((acc, item) => acc + item.total_shots, 0) / chartData.length
      : 0;

  return (
    <div className="relative bg-gray-800 rounded-lg p-6 flex flex-col justify-between hover:bg-gray-750 transition-colors overflow-hidden">
      {/* Machine Info */}
      <div className="relative z-0">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(getStatus(machine))}`} />
          <span className={`text-sm px-2.5 py-1 rounded-full ${getStatusBadgeStyle(getStatus(machine))}`}>
            {getStatus(machine)}
          </span>
        </div>
        <h3 className="text-4xl font-bold mb-2">{machine.machine_name || machine.machine_id}</h3>
      </div>

      {/* Background Chart */}
      <div className="absolute scale-105 transform inset-0 z-0 opacity-30">
        {isChartLoading ? (
          <div className="w-full h-full bg-gray-700 animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 0,
                bottom: 0,
                left: 0,
              }}
            >
              <XAxis
                dataKey="truncated_timestamp"
                tick={{ fontSize: 12 }}
                stroke="#ccc"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleString("nl-NL", { hour: "2-digit", minute: "2-digit" });
                }}
              />
              <YAxis hide={true} />
              <Line
                type="step"
                dataKey="total_shots"
                stroke={getStatusHex(getStatus(machine))}
                strokeWidth={3}
                dot={false}
              />
              <ReferenceLine y={medianHourlyShots} stroke="#ccc" strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Molds */}
      <div className="flex flex-wrap justify-around gap-2 mt-2">
        {isMoldsLoading
          ? Array(3)
              .fill(null)
              .map((_, idx) => (
                <div key={idx} className="w-full h-4 bg-gray-700 rounded-full animate-pulse mb-2"></div>
              ))
          : molds &&
            molds.map((matrijs) => (
              <div className="w-full" key={matrijs.mold_id}>
                <div className="text-sm font-medium mb-2">{matrijs.mold_name || matrijs.mold_id}</div>
              </div>
            ))}
      </div>
    </div>
  );
}

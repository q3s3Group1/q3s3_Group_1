"use client";
import { fetchMachineMolds } from '@/lib/supabase/fetchMachineMolds';
import { Machine, Mold } from '@/types/supabase';
import React, { useEffect, useState } from 'react';


interface MachineCardProps {
  machine: Machine;
}

export default function MachineCard({ machine  }: MachineCardProps) {
  const [matrijzen, setMatrijzen] = useState<Mold[]>([]);

  useEffect(() => {
    fetchMachineMolds(machine.machine_id).then(setMatrijzen);
  }, [machine.machine_id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actief':
        return 'bg-green-500';
      case 'Inactief':
        return 'bg-yellow-500';
      case 'Stilstand':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Actief':
        return 'bg-green-900/50 text-green-300 border border-green-700';
      case 'Inactief':
        return 'bg-yellow-900/50 text-yellow-300 border border-yellow-700';
      case 'Stilstand':
        return 'bg-red-900/50 text-red-300 border border-red-700';
      default:
        return 'bg-gray-900/50 text-gray-300 border border-gray-700';
    }
  };

  return (
    <div
    className="bg-gray-800 rounded-lg p-6 flex flex-col justify-between hover:bg-gray-750 transition-colors">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(machine.status)}`} />
          <span className={`text-sm px-2.5 py-1 rounded-full ${getStatusBadgeStyle(machine.status)}`}>
            {machine.status}
          </span>
        </div>
        <h3 className="text-4xl font-bold mb-2">{machine.machine_name || machine.machine_id}</h3>
        <div className="text-sm text-gray-400">
          Avg shot: {machine.avg_shot_time.toFixed(2)}s
        </div>
      </div>

      <div className="flex flex-wrap justify-around gap-2 mt-2">

      {matrijzen &&
        matrijzen.map((matrijs) => (
          <div className="w-full" key={matrijs.id}>
          <div className="text-sm font-medium mb-2">{matrijs.description}</div>
        </div>
        )

      )}
      </div>
    </div>
  );
}

import React from 'react';
import MachineCard from './MachineCard';
import { Machine } from '@/types/supabase';

interface FactoryGridProps {
  machines: Machine[];
}

export default function FactoryGrid({ machines }: FactoryGridProps) {
  

  return (
    <div className="flex-1 overflow-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 min-h-0 p-2">
        {machines.map((machine) => {
          // const matrijs = matrijzen.find(m => m.machineId === machine.id);
          return (
            <MachineCard 
              key={machine.machine_id} 
              machine={machine}
              // matrijs={matrijs}
            />
          );
        })}
      </div>
    </div>
  );
}
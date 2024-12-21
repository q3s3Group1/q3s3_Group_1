"use client";
import React, { useState, useEffect, useMemo } from 'react';
import FactoryGrid from '@/components/factory/FactoryGrid';
import FactoryStats from '@/components/factory/FactoryStats';
import FactoryHeader from '@/components/factory/FactoryHeader';
import { Machine } from '@/types/supabase';
import { fetchMachines } from '@/lib/supabase/fetchMachines';


export default function FactoryOverview() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // machine state
  const [machines, setMachines] = useState<Machine[]>([]);

  useEffect(() => {
    fetchMachines().then(setMachines);
    }, []);


  return (
    <div className="fixed inset-0 bg-gray-900 text-white z-50">
      <div className="h-screen flex flex-col">
        

        <div className="flex-1 overflow-hidden p-6">
          <div className="mx-auto h-full flex flex-col">

            {/* <FactoryStats
              locationName={currentLocation?.name}
              stats={stats}
            /> */}

            <FactoryGrid 
              machines={machines}
              currentTime={currentTime}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
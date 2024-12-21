"use client";
import React, { useState, useEffect, useMemo } from 'react';
import FactoryGrid from '@/components/factory/FactoryGrid';
import FactoryStats from '@/components/factory/FactoryStats';
import FactoryHeader from '@/components/factory/FactoryHeader';
import { Machine } from '@/types/supabase';
import { fetchMachines } from '@/lib/supabase/fetchMachines';


export default function FactoryOverview() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // machine state
  const [machines, setMachines] = useState<Machine[]>([]);

  useEffect(() => {
    fetchMachines().then(setMachines);
    }, []);

  // location stats
    const locationStats = useMemo(() => [
        { name: 'A', machines: 10, efficiency: 90, uptime: 98 },
        { name: 'B', machines: 8, efficiency: 85, uptime: 95 },
        { name: 'C', machines: 12, efficiency: 92, uptime: 99 },
        { name: 'D', machines: 6, efficiency: 88, uptime: 96 }
    ], []);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-cycle through locations unless paused
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentLocationIndex(prev => (prev + 1) % locationStats.length);
      setProgress(0);
    }, 15000); // Switch every 15 seconds

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 100));
    }, 150);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [locationStats.length, isPaused]);

  const currentLocation = locationStats[currentLocationIndex];

  


  const stats = useMemo(() => ({
    active: machines.filter(m => m.status === 'Actief').length,
    maintenance: machines.filter(m => m.status === 'Inactief').length,
    errors: machines.filter(m => m.status === 'Stilstand').length,
    efficiency: currentLocation?.efficiency || 0,
    uptime: currentLocation?.uptime || 0,
    total: machines.length
  }), [machines, currentLocation]);

  const handlePrevLocation = () => {
    setCurrentLocationIndex(prev => 
      prev === 0 ? locationStats.length - 1 : prev - 1
    );
    setProgress(0);
  };

  const handleNextLocation = () => {
    setCurrentLocationIndex(prev => 
      (prev + 1) % locationStats.length
    );
    setProgress(0);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 text-white z-50">
      <div className="h-screen flex flex-col">
        <FactoryHeader
          currentTime={currentTime}
          isPaused={isPaused}
          onPauseToggle={() => setIsPaused(!isPaused)}
          onPrevious={handlePrevLocation}
          onNext={handleNextLocation}
          progress={progress}
        />

        <div className="flex-1 overflow-hidden p-6">
          <div className="max-w-[1920px] mx-auto h-full flex flex-col">
            <FactoryStats
              locationName={currentLocation?.name}
              stats={stats}
            />

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
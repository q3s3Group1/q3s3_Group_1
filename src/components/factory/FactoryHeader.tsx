import React from 'react';
import { Activity, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

interface FactoryHeaderProps {
  currentTime: Date;
  isPaused: boolean;
  onPauseToggle: () => void;
  onPrevious: () => void;
  onNext: () => void;
  progress: number;
}

export default function FactoryHeader({
  currentTime,
  isPaused,
  onPauseToggle,
  onPrevious,
  onNext,
  progress,
}: FactoryHeaderProps) {
  return (
    <div className="flex-none border-b border-gray-800">
      <div className="max-w-[1920px] mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Activity className="h-6 w-6 text-blue-400" />
          <div>
            <h1 className="text-2xl font-bold">Factory Overview</h1>
            <div className="flex items-center mt-1">
              <span className="text-sm text-gray-400">
                {currentTime.toLocaleTimeString()}
              </span>
              <div className="ml-4 flex items-center">
                <button
                  onClick={onPauseToggle}
                  className={`
                    p-1.5 rounded-lg mr-2 transition-colors
                    ${isPaused 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                    }
                  `}
                >
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onPrevious}
                    className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={onNext}
                    className="p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <span className="ml-4 text-sm text-gray-400">Next update</span>
                <div className="ml-2 w-20 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-100"
                    style={{ width: `${isPaused ? 0 : progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
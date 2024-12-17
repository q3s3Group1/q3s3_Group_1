import { AlertOctagon, PowerIcon } from 'lucide-react';
import React from 'react';

interface StatusIndicatorProps {
  status: string;
}

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  const getStatusStyle = () => {
    if (status === 'Actief') return 'bg-green-500 border-green-600';
    if (status === 'Stilstand') return 'bg-red-500 border-red-600';
    if (status === 'Inactief') return 'bg-gray-500 border-gray-600';
    
  };

  // Icon
  const getIcon = (
    classname: string
  ) => {
    if (status === 'Actief') return <PowerIcon
    className={classname}
      />;
    if (status === 'Stilstand') return <PowerIcon
    className={classname}
      />;
    if (status === 'Inactief') return <AlertOctagon 
    className={classname}
    />;
  }

  return (
    <div className={`w-6 h-6 rounded-full border flex justify-center items-center ${getStatusStyle()}`}>
      <div>
      {getIcon(
        'size-4 text-white'
      )}
      </div>
    </div>
  );
}
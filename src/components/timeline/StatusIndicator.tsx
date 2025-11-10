
import { AlertOctagon, PowerIcon, PauseIcon } from 'lucide-react';
import React from 'react';

interface StatusIndicatorProps {
  status: string;
}

export default function StatusIndicator({ status }: StatusIndicatorProps) {
  const getStyle = () => {
    switch (status) {
      case 'operational': return 'bg-green-500 border-green-600';
      case 'standby':     return 'bg-yellow-500 border-yellow-600';
      case 'idle':        return 'bg-orange-500 border-orange-600';
      case 'inactive':    return 'bg-gray-500 border-gray-600';
      default:            return 'bg-gray-400 border-gray-500';
    }
  };

  const getIcon = (classname: string) => {
    switch (status) {
      case 'operational': return <PowerIcon className={classname} />;
      case 'standby':     return <PauseIcon className={classname} />;
      case 'idle':        return <PauseIcon className={classname} />;
      case 'inactive':    return <AlertOctagon className={classname} />;
      default:            return <AlertOctagon className={classname} />;
    }
  };

  return (
    <div className={`w-6 h-6 rounded-full border flex justify-center items-center ${getStyle()}`}>
      {getIcon('size-4 text-white')}
    </div>
  );
}

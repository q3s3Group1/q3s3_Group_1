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

  return (
    <div className={`w-3 h-3 rounded-full border ${getStatusStyle()}`} />
  );
}
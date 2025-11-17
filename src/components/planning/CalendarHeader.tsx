// components/CalendarHeader.tsx
"use client"

import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { nl, enUS } from 'date-fns/locale';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onNewPlanning: () => void;
}

export default function CalendarHeader({
  currentDate,
  onPrevious,
  onNext,
  onNewPlanning
}: CalendarHeaderProps) {
  const { t, language } = useLanguage();
  
  // Select the correct locale for date-fns
  const dateLocale = language === 'nl' ? nl : enUS;

  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('calendar.maintenancePlanning')}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevious}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </button>
            <div className="text-sm font-medium text-gray-600">
              {format(currentDate, 'MMMM yyyy', { locale: dateLocale })}
            </div>
            <button
              onClick={onNext}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
        <button 
          onClick={onNewPlanning}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t('calendar.newPlanning')}
        </button>
      </div>
    </div>
  );
}
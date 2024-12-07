import React from 'react';
import { format, isSameDay } from 'date-fns';
import { nl } from 'date-fns/locale';

interface WeekHeaderProps {
  days: Date[];
}

export default function WeekHeader({ days }: WeekHeaderProps) {

  const getTaskCount = (date: Date) => {
    // log date
    console.log(date);
    // return tasks.filter(task => isSameDay(task.date, date)).length;
    return 0;
  };

  return (
    <div className="flex-none w-48 border-r border-gray-200">
      {days.map((day) => {
        const taskCount = getTaskCount(day);
        const isToday = isSameDay(day, new Date());
        
        return (
          <div 
            key={day.toString()} 
            className="min-h-[12rem] flex border-b border-gray-200 last:border-b-0"
          >
            <div className="flex-1 px-4 flex flex-col justify-between py-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center
                ${isToday ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-gray-900">
                  {format(day, 'EEEE', { locale: nl })}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {format(day, 'd MMMM', { locale: nl })}
                  </span>
                  {taskCount > 0 && (
                    <span className={`
                      px-1.5 py-0.5 text-xs rounded-full font-medium
                      ${taskCount > 3 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-blue-100 text-blue-800'
                      }
                    `}>
                      {taskCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
import { cn } from '../../lib/utils';
import { CalendarDayCell } from './CalendarDayCell';
import { getMonthName } from './calendarUtils';
import type { CalendarMonth as CalendarMonthType, CalendarDay, ProjectColor } from '../../types';

interface CalendarMonthViewProps {
  calendarMonth: CalendarMonthType;
  color: ProjectColor;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onDayClick?: (day: CalendarDay) => void;
  selectedDateKey?: string;
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export function CalendarMonthView({
  calendarMonth,
  color,
  onPrevMonth,
  onNextMonth,
  onToday,
  onDayClick,
  selectedDateKey,
}: CalendarMonthViewProps) {
  const { year, month, weeks } = calendarMonth;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
      {/* 月份导航 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPrevMonth}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 transition-colors"
          aria-label="上一月"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {year}年 {getMonthName(month)}
          </h3>
          <button
            onClick={onToday}
            className="px-3 py-1 text-sm rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            今天
          </button>
        </div>

        <button
          onClick={onNextMonth}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 transition-colors"
          aria-label="下一月"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day, index) => (
          <div
            key={day}
            className={cn(
              'text-center text-xs font-medium py-2',
              index === 0 || index === 6
                ? 'text-slate-400 dark:text-slate-500'
                : 'text-slate-500 dark:text-slate-400'
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日历网格 */}
      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((day) => (
          <CalendarDayCell
            key={day.dateKey}
            day={day}
            color={color}
            onDayClick={onDayClick}
            isSelected={day.dateKey === selectedDateKey}
          />
        ))}
      </div>

      {/* 图例 */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-700/50" />
          <span className="text-xs text-slate-500 dark:text-slate-400">无打卡</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-900/30" />
          <span className="text-xs text-slate-500 dark:text-slate-400">1次</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-300 dark:bg-emerald-700/50" />
          <span className="text-xs text-slate-500 dark:text-slate-400">2次</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-500 dark:bg-emerald-600" />
          <span className="text-xs text-slate-500 dark:text-slate-400">3+次</span>
        </div>
      </div>
    </div>
  );
}

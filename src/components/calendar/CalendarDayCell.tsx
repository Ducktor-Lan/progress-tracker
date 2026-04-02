import { cn } from '../../lib/utils';
import type { CalendarDay as CalendarDayType, ProjectColor } from '../../types';

interface CalendarDayCellProps {
  day: CalendarDayType;
  color: ProjectColor;
  onDayClick?: (day: CalendarDayType) => void;
  isSelected?: boolean;
}

// 颜色背景映射（不同强度）
const getColorClasses = (color: ProjectColor, count: number) => {
  const colorMap: Record<ProjectColor, { light: string; medium: string; strong: string; ring: string }> = {
    emerald: {
      light: 'bg-emerald-100 dark:bg-emerald-900/30',
      medium: 'bg-emerald-300 dark:bg-emerald-700/50',
      strong: 'bg-emerald-500 dark:bg-emerald-600',
      ring: 'ring-emerald-500',
    },
    cyan: {
      light: 'bg-cyan-100 dark:bg-cyan-900/30',
      medium: 'bg-cyan-300 dark:bg-cyan-700/50',
      strong: 'bg-cyan-500 dark:bg-cyan-600',
      ring: 'ring-cyan-500',
    },
    amber: {
      light: 'bg-amber-100 dark:bg-amber-900/30',
      medium: 'bg-amber-300 dark:bg-amber-700/50',
      strong: 'bg-amber-500 dark:bg-amber-600',
      ring: 'ring-amber-500',
    },
    violet: {
      light: 'bg-violet-100 dark:bg-violet-900/30',
      medium: 'bg-violet-300 dark:bg-violet-700/50',
      strong: 'bg-violet-500 dark:bg-violet-600',
      ring: 'ring-violet-500',
    },
    rose: {
      light: 'bg-rose-100 dark:bg-rose-900/30',
      medium: 'bg-rose-300 dark:bg-rose-700/50',
      strong: 'bg-rose-500 dark:bg-rose-600',
      ring: 'ring-rose-500',
    },
    orange: {
      light: 'bg-orange-100 dark:bg-orange-900/30',
      medium: 'bg-orange-300 dark:bg-orange-700/50',
      strong: 'bg-orange-500 dark:bg-orange-600',
      ring: 'ring-orange-500',
    },
  };

  const colorClasses = colorMap[color];
  if (count === 0) return { bg: '', ring: colorClasses.ring };
  if (count === 1) return { bg: colorClasses.light, ring: colorClasses.ring };
  if (count === 2) return { bg: colorClasses.medium, ring: colorClasses.ring };
  return { bg: colorClasses.strong, ring: colorClasses.ring };
};

export function CalendarDayCell({ day, color, onDayClick, isSelected }: CalendarDayCellProps) {
  const { bg, ring } = getColorClasses(color, day.count);

  const handleClick = () => {
    if (onDayClick && !day.isFuture && !day.isBeforeStart) {
      onDayClick(day);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={day.isFuture || day.isBeforeStart}
      className={cn(
        'w-full aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all',
        'text-sm font-medium',
        day.isCurrentMonth ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-600',
        day.isToday && 'ring-2 ring-offset-1 dark:ring-offset-slate-800',
        day.isToday && ring,
        bg,
        day.count > 0 && !day.isFuture && !day.isBeforeStart && 'cursor-pointer hover:scale-105 hover:shadow-md',
        (day.isFuture || day.isBeforeStart) && 'cursor-not-allowed opacity-40',
        isSelected && 'ring-2 ring-offset-2 dark:ring-offset-slate-800',
        isSelected && ring
      )}
    >
      <span className={cn(
        day.count >= 3 && 'text-white dark:text-white font-bold'
      )}>
        {day.date.getDate()}
      </span>
      {day.count > 0 && (
        <span className={cn(
          'text-xs mt-0.5',
          day.count >= 3 ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
        )}>
          {day.count}
        </span>
      )}
    </button>
  );
}

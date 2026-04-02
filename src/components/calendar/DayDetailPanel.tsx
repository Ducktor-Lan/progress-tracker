import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { formatDisplayDate, formatTime } from './calendarUtils';
import type { CalendarDay, ProjectColor } from '../../types';
import { colorConfig } from '../../types';

interface DayDetailPanelProps {
  day: CalendarDay | null;
  color: ProjectColor;
  unitLabel: string;
  onClose: () => void;
}

export function DayDetailPanel({ day, color, unitLabel, onClose }: DayDetailPanelProps) {
  if (!day) return null;

  const colorClasses = colorConfig[color];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4"
      >
        {/* 头部 */}
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-slate-900 dark:text-white">
            {formatDisplayDate(day.dateKey)}
          </h4>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 打卡记录 */}
        {day.count === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
            这一天没有打卡记录
          </p>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <span className={cn('w-2 h-2 rounded-full', colorClasses.bg)} />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {day.count} 次打卡
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2">
              {day.records.map((record, index) => (
                <div
                  key={record.id}
                  className="flex items-start gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                >
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0',
                    colorClasses.bg
                  )}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-slate-900 dark:text-white">
                      #{parseInt(record.id) + 1} {unitLabel}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {formatTime(record.completedAt)}
                    </div>
                    {record.note && (
                      <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 truncate">
                        {record.note}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

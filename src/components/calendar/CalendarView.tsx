import { useState, useMemo } from 'react';
import { CalendarMonthView } from './CalendarMonthView';
import { DayDetailPanel } from './DayDetailPanel';
import { generateCalendarMonth } from './calendarUtils';
import { useProjectStore } from '../../store/projectStore';
import type { CalendarDay } from '../../types';

export function CalendarView() {
  const { getActiveProject } = useProjectStore();

  // 当前显示的年月
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  // 选中的日期
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  const project = getActiveProject();

  // 生成日历数据
  const calendarMonth = useMemo(() => {
    return generateCalendarMonth(
      year,
      month,
      project?.records || [],
      project?.startDate
    );
  }, [year, month, project?.records, project?.startDate]);

  // 导航
  const handlePrevMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setSelectedDay(null);
  };

  const handleDayClick = (day: CalendarDay) => {
    setSelectedDay(day);
  };

  const handleCloseDetail = () => {
    setSelectedDay(null);
  };

  if (!project) return null;

  return (
    <div className="space-y-4">
      {/* 日历网格 */}
      <CalendarMonthView
        calendarMonth={calendarMonth}
        color={project.color}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onDayClick={handleDayClick}
        selectedDateKey={selectedDay?.dateKey}
      />

      {/* 选中日期详情 */}
      {selectedDay && (
        <DayDetailPanel
          day={selectedDay}
          color={project.color}
          unitLabel={project.unitLabel}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}

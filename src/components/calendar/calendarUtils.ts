import type { CalendarDay, CalendarMonth, RecordEntry } from '../../types';

// 格式化日期为 YYYY-MM-DD
export const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 获取月份的第一天是周几 (0=周日, 1=周一, ...)
export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

// 获取月份的天数
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

// 检查是否是同一天
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// 生成日历月份数据
export const generateCalendarMonth = (
  year: number,
  month: number,
  records: RecordEntry[],
  startDate?: string
): CalendarMonth => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const projectStartDate = startDate ? new Date(startDate) : null;
  if (projectStartDate) projectStartDate.setHours(0, 0, 0, 0);

  // 构建日期到记录的映射
  const recordsByDate: Map<string, RecordEntry[]> = new Map();
  records.forEach((record) => {
    const dateKey = formatDateKey(new Date(record.completedAt));
    const existing = recordsByDate.get(dateKey) || [];
    existing.push(record);
    recordsByDate.set(dateKey, existing);
  });

  const weeks: CalendarDay[][] = [];
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);

  // 获取上个月的天数
  const prevMonthDays = getDaysInMonth(year, month - 1);

  let currentWeek: CalendarDay[] = [];

  // 填充第一周前面的空位（上个月的日期）
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const date = new Date(year, month - 1, day);
    const dateKey = formatDateKey(date);
    const dayRecords = recordsByDate.get(dateKey) || [];

    currentWeek.push({
      date,
      dateKey,
      isToday: false,
      isFuture: true,
      isBeforeStart: projectStartDate ? date < projectStartDate : false,
      isCurrentMonth: false,
      records: dayRecords,
      count: dayRecords.length,
    });
  }

  // 填充当月日期
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateKey = formatDateKey(date);
    const dayRecords = recordsByDate.get(dateKey) || [];

    currentWeek.push({
      date,
      dateKey,
      isToday: isSameDay(date, today),
      isFuture: date > today,
      isBeforeStart: projectStartDate ? date < projectStartDate : false,
      isCurrentMonth: true,
      records: dayRecords,
      count: dayRecords.length,
    });

    // 一周结束
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // 填充最后一周后面的空位
  if (currentWeek.length > 0) {
    let nextMonthDay = 1;
    while (currentWeek.length < 7) {
      const date = new Date(year, month + 1, nextMonthDay);
      const dateKey = formatDateKey(date);
      const dayRecords = recordsByDate.get(dateKey) || [];

      currentWeek.push({
        date,
        dateKey,
        isToday: false,
        isFuture: true,
        isBeforeStart: projectStartDate ? date < projectStartDate : false,
        isCurrentMonth: false,
        records: dayRecords,
        count: dayRecords.length,
      });
      nextMonthDay++;
    }
    weeks.push(currentWeek);
  }

  return { year, month, weeks };
};

// 获取月份名称
export const getMonthName = (month: number): string => {
  const months = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ];
  return months[month];
};

// 格式化日期显示
export const formatDisplayDate = (dateKey: string): string => {
  const date = new Date(dateKey);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const weekday = weekdays[date.getDay()];
  return `${month}月${day}日 ${weekday}`;
};

// 格式化时间显示
export const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

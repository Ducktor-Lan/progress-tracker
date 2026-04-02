// 目标项目接口
export interface Project {
  id: string;             // 唯一标识符
  title: string;          // 项目名称 (如: "200 Hours of Study")
  motivation: string;     // 核心驱动力 (如: "完成这篇论文发布")
  startDate: string;      // 开始日期 (ISO格式)
  targetUnits: number;    // 目标总数 (如: 200)
  unitLabel: string;      // 单位名称 (如: "Hours", "Days")
  color: ProjectColor;    // 主题颜色
  records: RecordEntry[]; // 打卡记录数组
  createdAt: string;      // 创建时间 (ISO格式)
  lastActiveAt: string;   // 最后活跃时间 (ISO格式)
}

// 单次打卡记录接口
export interface RecordEntry {
  id: string;             // 记录ID (通常对应网格的索引，0 到 targetUnits-1)
  completedAt: string;    // 完成的日期时间 (ISO格式)
  note?: string;          // (可选) 简短备注
}

// 预设主题颜色
export type ProjectColor =
  | 'emerald'    // 薄荷绿
  | 'cyan'       // 海浪蓝
  | 'amber'      // 活力黄
  | 'violet'     // 紫罗兰
  | 'rose'       // 玫瑰红
  | 'orange';    // 橙色

// 项目列表项（用于列表展示，不含完整 records）
export interface ProjectListItem {
  id: string;
  title: string;
  motivation: string;
  color: ProjectColor;
  progress: number;        // 完成百分比
  completed: number;       // 已完成数
  total: number;           // 总目标数
  lastActiveAt: string;    // 最后活跃时间
  createdAt: string;       // 创建时间
}

// 项目排序方式
export type SortOption = 'lastActive' | 'progress' | 'createdAt' | 'title';

// 排序方向
export type SortDirection = 'asc' | 'desc';

// 颜色配置映射
export const colorConfig: Record<ProjectColor, { bg: string; hover: string; ring: string }> = {
  emerald: {
    bg: 'bg-emerald-500',
    hover: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30',
    ring: 'ring-emerald-500',
  },
  cyan: {
    bg: 'bg-cyan-500',
    hover: 'hover:bg-cyan-100 dark:hover:bg-cyan-900/30',
    ring: 'ring-cyan-500',
  },
  amber: {
    bg: 'bg-amber-500',
    hover: 'hover:bg-amber-100 dark:hover:bg-amber-900/30',
    ring: 'ring-amber-500',
  },
  violet: {
    bg: 'bg-violet-500',
    hover: 'hover:bg-violet-100 dark:hover:bg-violet-900/30',
    ring: 'ring-violet-500',
  },
  rose: {
    bg: 'bg-rose-500',
    hover: 'hover:bg-rose-100 dark:hover:bg-rose-900/30',
    ring: 'ring-rose-500',
  },
  orange: {
    bg: 'bg-orange-500',
    hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/30',
    ring: 'ring-orange-500',
  },
};

// ==================== 日历相关类型 ====================

// 日历单日数据
export interface CalendarDay {
  date: Date;              // 日期对象
  dateKey: string;         // "YYYY-MM-DD" 格式
  isToday: boolean;        // 是否今天
  isFuture: boolean;       // 是否未来日期
  isBeforeStart: boolean;  // 是否在项目开始日期之前
  isCurrentMonth: boolean; // 是否当前月份
  records: RecordEntry[];  // 当日打卡记录
  count: number;           // 打卡次数
}

// 日历月份数据
export interface CalendarMonth {
  year: number;
  month: number;
  weeks: CalendarDay[][];  // 按周分组的日期
}

// 连续打卡统计
export interface StreakInfo {
  currentStreak: number;   // 当前连续天数
  longestStreak: number;   // 最长连续天数
  lastCheckIn: string;     // 最后打卡日期 "YYYY-MM-DD"
}

// 周统计
export interface WeeklyStats {
  weekStart: string;       // 周开始日期
  weekEnd: string;         // 周结束日期
  dailyCounts: number[];   // 每天打卡数 (周日到周六)
  totalCount: number;      // 周总打卡数
}

// ==================== 数据导出导入类型 ====================

// 导出数据格式
export interface ExportData {
  version: string;
  exportedAt: string;
  projects: Project[];
  settings: {
    isDarkMode: boolean;
  };
}

// ==================== 里程碑类型 ====================

// 里程碑定义
export interface Milestone {
  percentage: number;      // 里程碑百分比 (25, 50, 75, 100)
  reached: boolean;        // 是否已达成
  reachedAt?: string;      // 达成时间
}

// 预设里程碑
export const DEFAULT_MILESTONES = [25, 50, 75, 100] as const;

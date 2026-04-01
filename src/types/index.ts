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

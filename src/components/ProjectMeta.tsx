import { cn } from '../lib/utils';
import { useProjectStore } from '../store/projectStore';

interface ProgressBarProps {
  percentage: number;
  color: string;
}

function ProgressBar({ percentage, color }: ProgressBarProps) {
  return (
    <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
      <div
        className={cn(
          'h-full rounded-full transition-all duration-500 ease-out',
          color
        )}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
}

export function ProjectMeta() {
  const { getActiveProject, getProgress, getDaysSinceStart } = useProjectStore();

  const project = getActiveProject();

  if (!project) return null;

  const { completed, total, percentage } = getProgress();
  const daysElapsed = getDaysSinceStart();

  // 颜色映射
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-500',
    cyan: 'bg-cyan-500',
    amber: 'bg-amber-500',
    violet: 'bg-violet-500',
    rose: 'bg-rose-500',
    orange: 'bg-orange-500',
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
      {/* 项目标题和动力 */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {project.title}
        </h2>
        {project.motivation && (
          <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {project.motivation}
          </p>
        )}
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* 进度 */}
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
          <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1">
            {percentage}%
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">进度</div>
        </div>

        {/* 已完成 */}
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
          <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1">
            {completed}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            / {total} {project.unitLabel}
          </div>
        </div>

        {/* 已用天数 */}
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 text-center">
          <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-1">
            {daysElapsed}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">天</div>
        </div>
      </div>

      {/* 进度条 */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>开始日期: {new Date(project.startDate).toLocaleDateString('zh-CN')}</span>
          <span>{completed}/{total} 完成</span>
        </div>
        <ProgressBar percentage={percentage} color={colorMap[project.color] || 'bg-emerald-500'} />
      </div>
    </div>
  );
}

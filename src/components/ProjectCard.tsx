import { motion } from 'framer-motion';
import type { ProjectListItem } from '../types';
import { colorConfig } from '../types';
import { cn } from '../lib/utils';

interface ProjectCardProps {
  project: ProjectListItem;
  isActive: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onSelect: () => void;
}

export function ProjectCard({
  project,
  isActive,
  onEdit,
  onDelete,
  onDuplicate,
  onSelect,
}: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        'bg-white dark:bg-slate-800 rounded-xl border-2 overflow-hidden',
        'transition-colors duration-200',
        isActive
          ? 'border-emerald-500 dark:border-emerald-400 shadow-lg shadow-emerald-500/10'
          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
      )}
    >
      {/* 点击区域 - 选择项目 */}
      <button
        onClick={onSelect}
        className="w-full p-4 text-left"
      >
        {/* 头部：颜色标识 + 标题 + 活跃状态 */}
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'w-4 h-4 rounded-full flex-shrink-0 mt-0.5',
              colorConfig[project.color].bg
            )}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                {project.title}
              </h3>
              {isActive && (
                <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full">
                  当前
                </span>
              )}
            </div>
            {project.motivation && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 truncate">
                {project.motivation}
              </p>
            )}
          </div>
        </div>

        {/* 进度条和统计 */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600 dark:text-slate-300">
              {project.completed} / {project.total} 完成
            </span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {project.progress}%
            </span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className={cn('h-full rounded-full', colorConfig[project.color].bg)}
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* 底部信息 */}
        <div className="mt-3 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <span>更新于 {formatDate(project.lastActiveAt)}</span>
          <span>创建于 {formatDate(project.createdAt)}</span>
        </div>
      </button>

      {/* 操作按钮 */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
        <button
          onClick={onEdit}
          className={cn(
            'flex-1 py-1.5 px-3 rounded-lg text-sm font-medium',
            'text-slate-600 dark:text-slate-300',
            'hover:bg-slate-200 dark:hover:bg-slate-600',
            'transition-colors duration-150'
          )}
        >
          编辑
        </button>
        <button
          onClick={onDuplicate}
          className={cn(
            'flex-1 py-1.5 px-3 rounded-lg text-sm font-medium',
            'text-slate-600 dark:text-slate-300',
            'hover:bg-slate-200 dark:hover:bg-slate-600',
            'transition-colors duration-150'
          )}
        >
          复制
        </button>
        <button
          onClick={onDelete}
          className={cn(
            'py-1.5 px-3 rounded-lg text-sm font-medium',
            'text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/30',
            'transition-colors duration-150'
          )}
        >
          删除
        </button>
      </div>
    </motion.div>
  );
}

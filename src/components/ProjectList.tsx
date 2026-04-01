import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '../store/projectStore';
import { ProjectCard } from './ProjectCard';
import type { SortOption, SortDirection } from '../types';
import { cn } from '../lib/utils';

interface ProjectListProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateNew: () => void;
  onEdit: (projectId: string) => void;
}

export function ProjectList({ isOpen, onClose, onCreateNew, onEdit }: ProjectListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('lastActive');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const {
    projects,
    activeProjectId,
    setActiveProject,
    deleteProject,
    duplicateProject,
    getProjectList,
  } = useProjectStore();

  // 获取排序后的项目列表
  const projectList = getProjectList(sortBy, sortDir);

  // 搜索过滤
  const filteredProjects = projectList.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.motivation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteProject(id);
    setDeleteConfirmId(null);
  };

  const handleDuplicate = (id: string) => {
    duplicateProject(id);
  };

  const handleSelect = (id: string) => {
    setActiveProject(id);
    onClose();
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'lastActive', label: '最近活跃' },
    { value: 'progress', label: '进度' },
    { value: 'createdAt', label: '创建时间' },
    { value: 'title', label: '名称' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-2xl max-h-[85vh] bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 标题栏 */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    📋 项目管理
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    共 {projects.length} 个目标项目
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* 搜索和排序 */}
              <div className="mt-4 flex gap-3">
                {/* 搜索框 */}
                <div className="flex-1 relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="搜索项目..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      'w-full pl-10 pr-4 py-2 rounded-lg',
                      'bg-slate-100 dark:bg-slate-700',
                      'border border-transparent',
                      'focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800',
                      'text-slate-900 dark:text-white',
                      'placeholder-slate-400 dark:placeholder-slate-500',
                      'transition-colors duration-200'
                    )}
                  />
                </div>

                {/* 排序选择 */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className={cn(
                    'px-3 py-2 rounded-lg',
                    'bg-slate-100 dark:bg-slate-700',
                    'border border-transparent',
                    'text-slate-700 dark:text-slate-200',
                    'focus:border-emerald-500',
                    'cursor-pointer'
                  )}
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* 排序方向 */}
                <button
                  onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
                  className={cn(
                    'p-2 rounded-lg',
                    'bg-slate-100 dark:bg-slate-700',
                    'hover:bg-slate-200 dark:hover:bg-slate-600',
                    'text-slate-600 dark:text-slate-300',
                    'transition-colors duration-150'
                  )}
                  title={sortDir === 'asc' ? '升序' : '降序'}
                >
                  <svg
                    className={cn('w-5 h-5 transition-transform', sortDir === 'asc' && 'rotate-180')}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* 项目列表 */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-slate-500 dark:text-slate-400">
                    {searchQuery ? '没有找到匹配的项目' : '还没有创建任何项目'}
                  </p>
                  {!searchQuery && (
                    <button
                      onClick={() => {
                        onClose();
                        onCreateNew();
                      }}
                      className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
                    >
                      创建第一个目标
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4">
                  <AnimatePresence>
                    {filteredProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        isActive={project.id === activeProjectId}
                        onEdit={() => {
                          onEdit(project.id);
                          onClose();
                        }}
                        onDelete={() => setDeleteConfirmId(project.id)}
                        onDuplicate={() => handleDuplicate(project.id)}
                        onSelect={() => handleSelect(project.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* 底部按钮 */}
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
              <button
                onClick={() => {
                  onClose();
                  onCreateNew();
                }}
                className={cn(
                  'w-full py-3 rounded-xl font-medium',
                  'bg-gradient-to-r from-emerald-500 to-cyan-500',
                  'text-white shadow-lg shadow-emerald-500/25',
                  'hover:shadow-emerald-500/40',
                  'transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]'
                )}
              >
                ＋ 创建新目标
              </button>
            </div>
          </motion.div>

          {/* 删除确认弹窗 */}
          <AnimatePresence>
            {deleteConfirmId && (
              <motion.div
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDeleteConfirmId(null)}
              >
                <motion.div
                  className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-rose-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      确认删除
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                      此操作无法撤销，该项目的所有进度记录都将被永久删除。
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setDeleteConfirmId(null)}
                        className="flex-1 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => handleDelete(deleteConfirmId)}
                        className="flex-1 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-medium transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

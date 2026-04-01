import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '../store/projectStore';
import { colorConfig } from '../types';
import { cn } from '../lib/utils';

interface ProjectSwitcherProps {
  onCreateNew: () => void;
  onManageProjects: () => void;
}

export function ProjectSwitcher({ onCreateNew, onManageProjects }: ProjectSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    projects,
    activeProjectId,
    setActiveProject,
    getProjectList,
    getProgress,
  } = useProjectStore();

  const activeProject = projects.find((p) => p.id === activeProjectId);
  const projectList = getProjectList('lastActive', 'desc');

  // 点击外部关闭下拉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (projects.length === 0) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 当前项目按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg',
          'bg-slate-100 dark:bg-slate-800',
          'hover:bg-slate-200 dark:hover:bg-slate-700',
          'transition-colors duration-200',
          'border border-slate-200 dark:border-slate-700'
        )}
      >
        {/* 颜色标识 */}
        {activeProject && (
          <div className={cn('w-2.5 h-2.5 rounded-full', colorConfig[activeProject.color].bg)} />
        )}
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[150px] truncate">
          {activeProject?.title || '选择项目'}
        </span>
        <svg
          className={cn(
            'w-4 h-4 text-slate-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 下拉菜单 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute top-full left-0 mt-2 w-72 z-50',
              'bg-white dark:bg-slate-800',
              'rounded-xl shadow-lg border border-slate-200 dark:border-slate-700',
              'overflow-hidden'
            )}
          >
            {/* 项目列表 */}
            <div className="max-h-64 overflow-y-auto">
              {projectList.map((project) => {
                const isActive = project.id === activeProjectId;
                const progress = getProgress(project.id);

                return (
                  <button
                    key={project.id}
                    onClick={() => {
                      setActiveProject(project.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full px-4 py-3 flex items-center gap-3 text-left',
                      'hover:bg-slate-50 dark:hover:bg-slate-700/50',
                      'transition-colors duration-150',
                      isActive && 'bg-slate-50 dark:bg-slate-700/30'
                    )}
                  >
                    {/* 颜色标识 */}
                    <div
                      className={cn(
                        'w-3 h-3 rounded-full flex-shrink-0',
                        colorConfig[project.color].bg
                      )}
                    />

                    {/* 项目信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={cn(
                            'text-sm font-medium truncate',
                            isActive
                              ? 'text-slate-900 dark:text-white'
                              : 'text-slate-700 dark:text-slate-300'
                          )}
                        >
                          {project.title}
                        </span>
                        {isActive && (
                          <svg
                            className="w-4 h-4 text-emerald-500 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>

                      {/* 进度条 */}
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-300',
                              colorConfig[project.color].bg
                            )}
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0">
                          {progress.percentage}%
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 分隔线 */}
            <div className="border-t border-slate-200 dark:border-slate-700" />

            {/* 操作按钮 */}
            <div className="p-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onCreateNew();
                }}
                className={cn(
                  'w-full px-4 py-2 flex items-center gap-2 rounded-lg',
                  'text-sm text-slate-600 dark:text-slate-300',
                  'hover:bg-slate-100 dark:hover:bg-slate-700',
                  'transition-colors duration-150'
                )}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                创建新目标
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onManageProjects();
                }}
                className={cn(
                  'w-full px-4 py-2 flex items-center gap-2 rounded-lg',
                  'text-sm text-slate-600 dark:text-slate-300',
                  'hover:bg-slate-100 dark:hover:bg-slate-700',
                  'transition-colors duration-150'
                )}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                管理所有项目
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

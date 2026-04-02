import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './components/Header';
import { ProjectMeta } from './components/ProjectMeta';
import { TrackerGrid } from './components/TrackerGrid';
import { CalendarView } from './components/calendar';
import { EmptyState } from './components/EmptyState';
import { ProjectSetupModal } from './components/ProjectSetupModal';
import { ProjectList } from './components/ProjectList';
import { DataManagePanel } from './components/DataManagePanel';
import { MilestoneCelebration } from './components/MilestoneCelebration';
import { useProjectStore } from './store/projectStore';
import type { ProjectColor } from './types';

function App() {
  const {
    projects,
    activeProjectId,
    isDarkMode,
    createProject,
    updateProject,
    getActiveProject,
    toggleDarkMode,
  } = useProjectStore();

  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProjectListOpen, setIsProjectListOpen] = useState(false);
  const [isDataManageOpen, setIsDataManageOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');

  const activeProject = getActiveProject();
  const hasProject = projects.length > 0;

  // 初始化时如果没有项目，打开创建弹窗
  useEffect(() => {
    if (projects.length === 0) {
      setIsSetupModalOpen(true);
    }
  }, [projects.length]);

  // 应用深色模式
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleCreateProject = (projectData: {
    title: string;
    motivation: string;
    startDate: string;
    targetUnits: number;
    unitLabel: string;
    color: ProjectColor;
  }) => {
    createProject(projectData);
    setIsSetupModalOpen(false);
  };

  const handleUpdateProject = (projectData: {
    title: string;
    motivation: string;
    startDate: string;
    targetUnits: number;
    unitLabel: string;
    color: ProjectColor;
  }) => {
    if (editingProjectId) {
      updateProject(editingProjectId, projectData);
      setEditingProjectId(null);
    } else if (activeProjectId) {
      updateProject(activeProjectId, projectData);
    }
    setIsEditModalOpen(false);
  };

  const handleEditProject = (projectId: string) => {
    setEditingProjectId(projectId);
    setIsEditModalOpen(true);
  };

  // 获取正在编辑的项目
  const editingProject = editingProjectId
    ? projects.find((p) => p.id === editingProjectId)
    : activeProject;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Header
        onSettingsClick={() => {
          setEditingProjectId(null);
          setIsEditModalOpen(true);
        }}
        onCreateNew={() => setIsSetupModalOpen(true)}
        onManageProjects={() => setIsProjectListOpen(true)}
        onDataManage={() => setIsDataManageOpen(true)}
        hasProject={hasProject}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <main className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        <AnimatePresence mode="wait">
          {activeProject ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* 项目元信息和进度 */}
              <ProjectMeta />

              {/* 视图内容 - 网格或日历 */}
              <AnimatePresence mode="wait">
                {viewMode === 'grid' ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TrackerGrid />
                  </motion.div>
                ) : (
                  <motion.div
                    key="calendar"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CalendarView />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 底部提示 */}
              {viewMode === 'grid' && (
                <motion.div
                  className="text-center text-sm text-slate-400 dark:text-slate-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  💡 点击格子记录进度，右键可添加备注
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EmptyState />
              {hasProject && (
                <motion.div
                  className="flex justify-center mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <button
                    onClick={() => setIsProjectListOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all hover:scale-105 active:scale-95"
                  >
                    选择一个项目
                  </button>
                </motion.div>
              )}
              {!hasProject && (
                <motion.div
                  className="flex justify-center mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <button
                    onClick={() => setIsSetupModalOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all hover:scale-105 active:scale-95"
                  >
                    创建我的第一个目标
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 深色模式切换按钮 (浮动) */}
      <motion.button
        onClick={toggleDarkMode}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-110 transition-transform"
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </motion.button>

      {/* 创建项目弹窗 */}
      <ProjectSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onSubmit={handleCreateProject}
        mode="create"
      />

      {/* 编辑项目弹窗 */}
      <ProjectSetupModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProjectId(null);
        }}
        onSubmit={handleUpdateProject}
        initialValues={
          editingProject
            ? {
                title: editingProject.title,
                motivation: editingProject.motivation,
                startDate: editingProject.startDate,
                targetUnits: editingProject.targetUnits,
                unitLabel: editingProject.unitLabel,
                color: editingProject.color,
              }
            : undefined
        }
        mode="edit"
      />

      {/* 项目管理面板 */}
      <ProjectList
        isOpen={isProjectListOpen}
        onClose={() => setIsProjectListOpen(false)}
        onCreateNew={() => setIsSetupModalOpen(true)}
        onEdit={handleEditProject}
      />

      {/* 数据管理面板 */}
      <DataManagePanel
        isOpen={isDataManageOpen}
        onClose={() => setIsDataManageOpen(false)}
      />

      {/* 里程碑庆祝动画 */}
      <MilestoneCelebration />
    </div>
  );
}

export default App;

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Project, RecordEntry, ProjectListItem, SortOption, SortDirection } from '../types';

interface ProjectState {
  // === 状态 ===
  projects: Project[];              // 项目数组
  activeProjectId: string | null;   // 当前激活项目ID
  isDarkMode: boolean;

  // === 项目管理操作 ===
  createProject: (project: Omit<Project, 'id' | 'records' | 'createdAt' | 'lastActiveAt'>) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string | null) => void;
  duplicateProject: (id: string) => string;

  // === 打卡操作 ===
  toggleComplete: (index: number) => void;
  addNote: (index: number, note: string) => void;
  removeNote: (index: number) => void;

  // === 查询方法 ===
  getActiveProject: () => Project | null;
  getProjectById: (id: string) => Project | undefined;
  getProjectList: (sortBy?: SortOption, sortDir?: SortDirection) => ProjectListItem[];
  getProgress: (projectId?: string) => { completed: number; total: number; percentage: number };
  getDaysSinceStart: (projectId?: string) => number;

  // === 全局设置 ===
  toggleDarkMode: () => void;
  reorderProjects: (fromIndex: number, toIndex: number) => void;
}

// 生成唯一ID
const generateId = () => Math.random().toString(36).substring(2, 11);

// 计算从开始日期到今天的天数
const calculateDaysSince = (startDate: string): number => {
  const start = new Date(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - start.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) + 1;
};

// 获取当前时间戳
const now = () => new Date().toISOString();

// 数据迁移：从旧版本格式迁移到新格式
const migrateOldData = (persistedState: unknown): Partial<ProjectState> => {
  const state = persistedState as Record<string, unknown>;

  // 检测旧格式（单个 project）
  if (state && 'project' in state && !('projects' in state)) {
    const oldProject = state.project as Project | null;
    return {
      projects: oldProject ? [oldProject] : [],
      activeProjectId: oldProject?.id || null,
      isDarkMode: (state.isDarkMode as boolean) || false,
    };
  }

  return state as Partial<ProjectState>;
};

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      // === 初始状态 ===
      projects: [],
      activeProjectId: null,
      isDarkMode: false,

      // === 创建新项目 ===
      createProject: (projectData) => {
        const id = generateId();
        const timestamp = now();
        const newProject: Project = {
          ...projectData,
          id,
          records: [],
          createdAt: timestamp,
          lastActiveAt: timestamp,
        };
        set((state) => ({
          projects: [...state.projects, newProject],
          activeProjectId: id,
        }));
        return id;
      },

      // === 更新项目信息 ===
      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, lastActiveAt: now() } : p
          ),
        }));
      },

      // === 删除项目 ===
      deleteProject: (id) => {
        set((state) => {
          const newProjects = state.projects.filter((p) => p.id !== id);
          const newActiveId =
            state.activeProjectId === id
              ? newProjects.length > 0
                ? newProjects[0].id
                : null
              : state.activeProjectId;
          return {
            projects: newProjects,
            activeProjectId: newActiveId,
          };
        });
      },

      // === 设置当前激活项目 ===
      setActiveProject: (id) => {
        set({ activeProjectId: id });
      },

      // === 复制项目 ===
      duplicateProject: (id) => {
        const { projects } = get();
        const project = projects.find((p) => p.id === id);
        if (!project) return '';

        const newId = generateId();
        const timestamp = now();
        const newProject: Project = {
          ...project,
          id: newId,
          title: `${project.title} (副本)`,
          records: [], // 复制的项目不复制打卡记录
          createdAt: timestamp,
          lastActiveAt: timestamp,
        };

        set((state) => ({
          projects: [...state.projects, newProject],
          activeProjectId: newId,
        }));

        return newId;
      },

      // === 切换单元格完成状态 ===
      toggleComplete: (index) => {
        const { activeProjectId } = get();
        if (!activeProjectId) return;

        set((state) => ({
          projects: state.projects.map((project) => {
            if (project.id !== activeProjectId) return project;

            const existingIndex = project.records.findIndex(
              (r) => r.id === index.toString()
            );
            let newRecords: RecordEntry[];

            if (existingIndex >= 0) {
              newRecords = project.records.filter(
                (r) => r.id !== index.toString()
              );
            } else {
              newRecords = [
                ...project.records,
                {
                  id: index.toString(),
                  completedAt: now(),
                },
              ];
            }

            return { ...project, records: newRecords, lastActiveAt: now() };
          }),
        }));
      },

      // === 添加备注 ===
      addNote: (index, note) => {
        const { activeProjectId } = get();
        if (!activeProjectId) return;

        set((state) => ({
          projects: state.projects.map((project) => {
            if (project.id !== activeProjectId) return project;

            const newRecords = project.records.map((r) =>
              r.id === index.toString() ? { ...r, note } : r
            );

            if (!project.records.find((r) => r.id === index.toString())) {
              newRecords.push({
                id: index.toString(),
                completedAt: now(),
                note,
              });
            }

            return { ...project, records: newRecords, lastActiveAt: now() };
          }),
        }));
      },

      // === 移除备注 ===
      removeNote: (index) => {
        const { activeProjectId } = get();
        if (!activeProjectId) return;

        set((state) => ({
          projects: state.projects.map((project) => {
            if (project.id !== activeProjectId) return project;
            const newRecords = project.records.map((r) =>
              r.id === index.toString() ? { ...r, note: undefined } : r
            );
            return { ...project, records: newRecords };
          }),
        }));
      },

      // === 切换深色模式 ===
      toggleDarkMode: () => {
        set((state) => {
          const newDarkMode = !state.isDarkMode;
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDarkMode: newDarkMode };
        });
      },

      // === 获取当前激活项目 ===
      getActiveProject: () => {
        const { projects, activeProjectId } = get();
        return projects.find((p) => p.id === activeProjectId) || null;
      },

      // === 根据ID获取项目 ===
      getProjectById: (id) => {
        return get().projects.find((p) => p.id === id);
      },

      // === 获取项目列表（用于列表展示）===
      getProjectList: (sortBy = 'lastActive', sortDir = 'desc') => {
        const { projects } = get();
        const list: ProjectListItem[] = projects.map((p) => ({
          id: p.id,
          title: p.title,
          motivation: p.motivation,
          color: p.color,
          progress: p.targetUnits > 0 ? Math.round((p.records.length / p.targetUnits) * 100) : 0,
          completed: p.records.length,
          total: p.targetUnits,
          lastActiveAt: p.lastActiveAt,
          createdAt: p.createdAt,
        }));

        // 排序
        const sortFunctions: Record<SortOption, (a: ProjectListItem, b: ProjectListItem) => number> = {
          lastActive: (a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime(),
          progress: (a, b) => b.progress - a.progress,
          createdAt: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          title: (a, b) => a.title.localeCompare(b.title, 'zh-CN'),
        };

        const sorted = [...list].sort(sortFunctions[sortBy]);
        return sortDir === 'desc' ? sorted : sorted.reverse();
      },

      // === 获取进度信息 ===
      getProgress: (projectId) => {
        const { projects, activeProjectId } = get();
        const targetId = projectId || activeProjectId;
        const project = projects.find((p) => p.id === targetId);

        if (!project) return { completed: 0, total: 0, percentage: 0 };

        const completed = project.records.length;
        const total = project.targetUnits;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { completed, total, percentage };
      },

      // === 获取已用天数 ===
      getDaysSinceStart: (projectId) => {
        const { projects, activeProjectId } = get();
        const targetId = projectId || activeProjectId;
        const project = projects.find((p) => p.id === targetId);

        if (!project) return 0;
        return calculateDaysSince(project.startDate);
      },

      // === 重新排序项目 ===
      reorderProjects: (fromIndex, toIndex) => {
        set((state) => {
          const newProjects = [...state.projects];
          const [removed] = newProjects.splice(fromIndex, 1);
          newProjects.splice(toIndex, 0, removed);
          return { projects: newProjects };
        });
      },
    }),
    {
      name: 'progress-tracker-storage',
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persistedState, version) => {
        // 从旧版本迁移数据
        if (version < 2) {
          return migrateOldData(persistedState);
        }
        return persistedState as ProjectState;
      },
      partialize: (state) => ({
        projects: state.projects,
        activeProjectId: state.activeProjectId,
        isDarkMode: state.isDarkMode,
      }),
      onRehydrateStorage: () => (state) => {
        // 恢复深色模式状态
        if (state?.isDarkMode) {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProjectColor } from '../types';
import { cn } from '../lib/utils';

interface ProjectSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: {
    title: string;
    motivation: string;
    startDate: string;
    targetUnits: number;
    unitLabel: string;
    color: ProjectColor;
  }) => void;
  initialValues?: {
    title: string;
    motivation: string;
    startDate: string;
    targetUnits: number;
    unitLabel: string;
    color: ProjectColor;
  };
  mode?: 'create' | 'edit';
}

const colorOptions: { value: ProjectColor; label: string; class: string }[] = [
  { value: 'emerald', label: '薄荷绿', class: 'bg-emerald-500' },
  { value: 'cyan', label: '海浪蓝', class: 'bg-cyan-500' },
  { value: 'amber', label: '活力黄', class: 'bg-amber-500' },
  { value: 'violet', label: '紫罗兰', class: 'bg-violet-500' },
  { value: 'rose', label: '玫瑰红', class: 'bg-rose-500' },
  { value: 'orange', label: '橙色', class: 'bg-orange-500' },
];

export function ProjectSetupModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  mode = 'create',
}: ProjectSetupModalProps) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [motivation, setMotivation] = useState(initialValues?.motivation || '');
  const [startDate, setStartDate] = useState(
    initialValues?.startDate || new Date().toISOString().split('T')[0]
  );
  const [targetUnits, setTargetUnits] = useState(initialValues?.targetUnits || 100);
  const [unitLabel, setUnitLabel] = useState(initialValues?.unitLabel || '次');
  const [color, setColor] = useState<ProjectColor>(initialValues?.color || 'emerald');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      motivation: motivation.trim(),
      startDate,
      targetUnits: Math.max(1, Math.min(1000, targetUnits)),
      unitLabel: unitLabel.trim() || '次',
      color,
    });

    // 重置表单（仅在创建模式）
    if (mode === 'create') {
      setTitle('');
      setMotivation('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setTargetUnits(100);
      setUnitLabel('次');
      setColor('emerald');
    }
  };

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
            className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 标题 */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {mode === 'create' ? '🎯 创建新目标' : '⚙️ 编辑目标'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {mode === 'create'
                  ? '设定你的目标，开始追踪进度吧！'
                  : '修改你的目标设置'}
              </p>
            </div>

            {/* 表单 */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* 目标名称 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  目标名称 *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如：200小时学习计划"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* 核心动力 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  核心动力
                </label>
                <input
                  type="text"
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="例如：完成这篇论文发布"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              {/* 目标数量和单位 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    目标数量
                  </label>
                  <input
                    type="number"
                    value={targetUnits}
                    onChange={(e) => setTargetUnits(parseInt(e.target.value) || 1)}
                    min={1}
                    max={1000}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    单位名称
                  </label>
                  <input
                    type="text"
                    value={unitLabel}
                    onChange={(e) => setUnitLabel(e.target.value)}
                    placeholder="次"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* 开始日期 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  开始日期
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              {/* 颜色选择 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  主题颜色
                </label>
                <div className="flex gap-2 flex-wrap">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setColor(option.value)}
                      className={cn(
                        'w-8 h-8 rounded-full transition-all',
                        option.class,
                        color === option.value
                          ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white'
                          : 'hover:scale-110'
                      )}
                      title={option.label}
                    />
                  ))}
                </div>
              </div>

              {/* 按钮组 */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors"
                >
                  {mode === 'create' ? '创建目标' : '保存修改'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

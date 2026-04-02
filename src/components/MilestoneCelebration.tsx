import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useProjectStore } from '../store/projectStore';
import { DEFAULT_MILESTONES } from '../types';

// 里程碑配置
const MILESTONE_CONFIG: Record<number, { emoji: string; title: string; description: string }> = {
  25: { emoji: '🌟', title: '四分之一达成！', description: '你已经完成了 25%，继续加油！' },
  50: { emoji: '🎯', title: '半程里程碑！', description: '你已经完成了一半，胜利在望！' },
  75: { emoji: '🚀', title: '接近终点！', description: '你已经完成了 75%，最后冲刺！' },
  100: { emoji: '🏆', title: '目标达成！', description: '恭喜你完成了全部目标！太棒了！' },
};

// 触发庆祝动画
const triggerCelebration = (percentage: number) => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  // 根据里程碑级别调整动画强度
  const intensity = percentage / 25; // 1, 2, 3, or 4

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = 50 * intensity * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ef4444'],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ef4444'],
    });
  }, 250);

  // 100% 时添加特殊烟花效果
  if (percentage === 100) {
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96e6a1'],
      });
    }, 500);
  }
};

export function MilestoneCelebration() {
  const { getProgress, getActiveProject } = useProjectStore();
  const [showModal, setShowModal] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<number | null>(null);
  const [celebratedMilestones, setCelebratedMilestones] = useState<Set<number>>(new Set());

  const project = getActiveProject();
  const { percentage } = getProgress();

  // 检查里程碑
  const checkMilestone = useCallback(() => {
    if (!project) return;

    for (const milestone of DEFAULT_MILESTONES) {
      if (percentage >= milestone && !celebratedMilestones.has(milestone)) {
        // 触发里程碑庆祝
        setCurrentMilestone(milestone);
        setShowModal(true);
        setCelebratedMilestones((prev) => new Set(prev).add(milestone));
        triggerCelebration(milestone);
        break;
      }
    }
  }, [percentage, celebratedMilestones, project]);

  useEffect(() => {
    checkMilestone();
  }, [percentage, checkMilestone]);

  const handleClose = () => {
    setShowModal(false);
    setCurrentMilestone(null);
  };

  if (!showModal || currentMilestone === null) return null;

  const config = MILESTONE_CONFIG[currentMilestone];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* 背景遮罩 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* 弹窗内容 */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 表情 */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', damping: 10, stiffness: 200 }}
            className="text-7xl mb-4"
          >
            {config.emoji}
          </motion.div>

          {/* 标题 */}
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-slate-900 dark:text-white mb-2"
          >
            {config.title}
          </motion.h2>

          {/* 描述 */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-600 dark:text-slate-300 mb-6"
          >
            {config.description}
          </motion.p>

          {/* 进度显示 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <div className="text-4xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
              {currentMilestone}%
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              目标进度
            </div>
          </motion.div>

          {/* 关闭按钮 */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={handleClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
          >
            继续加油！
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

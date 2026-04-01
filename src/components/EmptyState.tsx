import { motion } from 'framer-motion';

export function EmptyState() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[60vh] px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 动画图标 */}
      <motion.div
        className="relative mb-8"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        {/* 装饰圆点 */}
        <motion.div
          className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-400"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-1 -left-3 w-3 h-3 rounded-full bg-violet-400"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </motion.div>

      {/* 标题 */}
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 text-center">
        开始你的第一个目标
      </h2>

      {/* 描述 */}
      <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-8">
        创建一个目标追踪计划，使用网格化的方式记录你的进度。
        无论是学习时间、健身天数还是阅读目标，都可以轻松管理。
      </p>

      {/* 特性列表 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
        {[
          { icon: '📊', title: '可视化进度', desc: '直观的网格展示' },
          { icon: '🎯', title: '目标追踪', desc: '设定并达成目标' },
          { icon: '💪', title: '持续激励', desc: '每一步都算数' },
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <div className="text-2xl mb-2">{feature.icon}</div>
            <div className="font-medium text-slate-900 dark:text-white text-sm">
              {feature.title}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {feature.desc}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

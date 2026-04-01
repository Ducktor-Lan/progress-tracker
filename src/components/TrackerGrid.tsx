import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { useProjectStore } from '../store/projectStore';
import { colorConfig, type ProjectColor } from '../types';
import { useState } from 'react';

interface GridCellProps {
  index: number;
  isCompleted: boolean;
  note?: string;
  completedAt?: string;
  color: ProjectColor;
  onToggle: () => void;
  onAddNote: (note: string) => void;
}

function GridCell({
  index,
  isCompleted,
  note,
  completedAt,
  color,
  onToggle,
  onAddNote
}: GridCellProps) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState(note || '');
  const colorStyle = colorConfig[color];

  const handleClick = () => {
    onToggle();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isCompleted) {
      setShowNoteInput(true);
    }
  };

  const handleNoteSubmit = () => {
    if (noteText.trim()) {
      onAddNote(noteText.trim());
    }
    setShowNoteInput(false);
  };

  return (
    <motion.div
      className={cn(
        'aspect-square rounded-lg cursor-pointer relative group',
        'border-2 transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        isCompleted
          ? [colorStyle.bg, 'border-transparent', `focus:${colorStyle.ring}`]
          : ['bg-slate-100 dark:bg-slate-800', 'border-slate-200 dark:border-slate-700', colorStyle.hover]
      )}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
        delay: index * 0.002
      }}
      tabIndex={0}
      role="button"
      aria-label={`Unit ${index + 1}${isCompleted ? ' completed' : ''}`}
      aria-pressed={isCompleted}
    >
      {/* 完成标记 */}
      {isCompleted && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          <svg
            className="w-4 h-4 text-white opacity-80"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
      )}

      {/* 序号提示 */}
      <div className={cn(
        'absolute bottom-0.5 right-1 text-[8px] font-medium opacity-0 group-hover:opacity-60 transition-opacity',
        isCompleted ? 'text-white' : 'text-slate-500 dark:text-slate-400'
      )}>
        {index + 1}
      </div>

      {/* 备注/日期提示 */}
      {isCompleted && completedAt && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full opacity-80" />
      )}

      {/* 备注输入弹窗 */}
      {showNoteInput && (
        <div
          className="absolute inset-0 z-10 bg-white dark:bg-slate-900 rounded-lg p-1 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <textarea
            className="w-full h-full text-xs p-1 resize-none border-none focus:outline-none bg-transparent"
            placeholder="添加备注..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            autoFocus
          />
          <div className="absolute bottom-1 right-1 flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowNoteInput(false);
                setNoteText(note || '');
              }}
              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700"
            >
              取消
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNoteSubmit();
              }}
              className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500 text-white"
            >
              保存
            </button>
          </div>
        </div>
      )}

      {/* 备注提示 */}
      {note && !showNoteInput && (
        <div className="absolute inset-0 flex items-center justify-center p-1">
          <span className="text-[6px] text-white text-center line-clamp-2 opacity-80">
            {note}
          </span>
        </div>
      )}
    </motion.div>
  );
}

interface TrackerGridProps {
  onCellClick?: (index: number) => void;
}

export function TrackerGrid({ onCellClick }: TrackerGridProps) {
  const { getActiveProject, toggleComplete, addNote } = useProjectStore();

  const project = getActiveProject();

  if (!project) return null;

  const cells = Array.from({ length: project.targetUnits }, (_, i) => {
    const record = project.records.find(r => r.id === i.toString());
    return {
      index: i,
      isCompleted: !!record,
      note: record?.note,
      completedAt: record?.completedAt,
    };
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
      <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-20 gap-1.5 sm:gap-2">
        {cells.map((cell) => (
          <GridCell
            key={cell.index}
            index={cell.index}
            isCompleted={cell.isCompleted}
            note={cell.note}
            completedAt={cell.completedAt}
            color={project.color}
            onToggle={() => {
              toggleComplete(cell.index);
              onCellClick?.(cell.index);
            }}
            onAddNote={(note) => addNote(cell.index, note)}
          />
        ))}
      </div>

      {/* 图例 */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
          <span>未完成</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn('w-4 h-4 rounded', colorConfig[project.color].bg)} />
          <span>已完成</span>
        </div>
      </div>
    </div>
  );
}

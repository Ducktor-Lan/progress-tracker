# 🎯 Progress Tracker - 目标进度追踪器

一个简洁优雅的目标进度追踪应用，帮助你可视化并追踪你的目标完成情况。

![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.2-06B6D4?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)

## ✨ 功能特性

- 📊 **可视化进度网格** - 直观的网格布局展示目标完成进度
- 📁 **多项目管理** - 支持创建和管理多个目标项目
- 🎨 **六种主题颜色** - emerald、cyan、amber、violet、rose、orange
- 📝 **备注功能** - 右键点击已完成的格子添加备注
- 🌙 **深色模式** - 支持浅色/深色主题切换
- 💾 **本地存储** - 数据自动保存到浏览器本地，无需登录
- 📱 **响应式设计** - 完美适配桌面端和移动端
- ⚡ **流畅动画** - 使用 Framer Motion 实现丝滑的交互动画

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm 或 yarn 或 pnpm

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/your-username/progress-tracker.git

# 进入项目目录
cd progress-tracker

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `dist` 目录中。

## 📖 使用指南

### 创建项目

1. 首次使用时会自动弹出创建项目窗口
2. 填写项目信息：
   - **项目名称**：如"200小时学习计划"
   - **核心动力**：激励自己完成目标的原因
   - **开始日期**：目标开始追踪的日期
   - **目标数量**：总共要完成的单位数
   - **单位名称**：如"小时"、"天"、"次"等
   - **主题颜色**：选择喜欢的颜色主题

### 打卡记录

- **点击格子**：切换完成/未完成状态
- **右键格子**：为已完成的格子添加备注

### 项目管理

- 点击右上角 **☰** 按钮打开项目管理面板
- 可以查看所有项目、编辑、复制或删除项目
- 支持按最后活跃时间、进度、创建时间、名称排序

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| [React](https://react.dev/) | 19.2.4 | 前端框架 |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | 类型安全 |
| [Vite](https://vitejs.dev/) | 8.0 | 构建工具 |
| [Tailwind CSS](https://tailwindcss.com/) | 4.2 | 样式框架 |
| [Zustand](https://zustand-demo.pmnd.rs/) | 5.0 | 状态管理 |
| [Framer Motion](https://www.framer.com/motion/) | 12.38 | 动画库 |
| [Lucide React](https://lucide.dev/) | 1.7 | 图标库 |

## 📁 项目结构

```
progress-tracker/
├── src/
│   ├── components/        # React 组件
│   │   ├── Header.tsx         # 头部导航
│   │   ├── TrackerGrid.tsx    # 打卡网格
│   │   ├── ProjectMeta.tsx    # 项目元信息
│   │   ├── ProjectList.tsx    # 项目列表
│   │   ├── ProjectSetupModal.tsx  # 项目创建/编辑弹窗
│   │   └── EmptyState.tsx     # 空状态提示
│   ├── store/             # 状态管理
│   │   └── projectStore.ts    # Zustand store
│   ├── types/             # TypeScript 类型定义
│   │   └── index.ts
│   ├── lib/               # 工具函数
│   │   └── utils.ts
│   ├── App.tsx            # 主应用组件
│   ├── main.tsx           # 入口文件
│   └── index.css          # 全局样式
├── public/                # 静态资源
├── index.html             # HTML 模板
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
└── README.md              # 项目说明
```

## 🎨 自定义颜色

项目内置 6 种主题颜色，在 `src/types/index.ts` 中定义：

```typescript
export type ProjectColor = 'emerald' | 'cyan' | 'amber' | 'violet' | 'rose' | 'orange';
```

你可以通过修改 `colorConfig` 对象来自定义颜色样式。

## 💾 数据存储

所有数据保存在浏览器的 `localStorage` 中，存储键名为 `progress-tracker-storage`。

数据结构示例：
```json
{
  "projects": [
    {
      "id": "abc123",
      "title": "200小时学习计划",
      "motivation": "完成论文答辩",
      "startDate": "2024-01-01",
      "targetUnits": 200,
      "unitLabel": "小时",
      "color": "emerald",
      "records": [
        { "id": "0", "completedAt": "2024-01-01T10:00:00Z", "note": "第一天" }
      ],
      "createdAt": "2024-01-01T00:00:00Z",
      "lastActiveAt": "2024-01-01T10:00:00Z"
    }
  ],
  "activeProjectId": "abc123",
  "isDarkMode": false
}
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

感谢以下开源项目：
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Lucide](https://lucide.dev/)

---

用 ❤️ 打造，祝你早日达成目标！🎯

# 像素拼豆工作室 (PixelBead AI Studio)

一个基于React和AI的像素拼豆设计工具，可以将图片转换为像素拼豆图案。

## 功能特点

- 🖼️ **图片上传与处理** - 支持上传各种图片格式并自动处理
- 🎨 **多种调色板** - 内置多种拼豆调色板供选择
- 🎨 **智能颜色分析** - 使用高级算法进行智能颜色量化和分析
- 📐 **自定义尺寸** - 可调整拼豆图案的宽度和高度
- 🎯 **实时预览** - 实时显示原始图片和拼豆效果对比
- 📊 **颜色统计** - 显示每种颜色所需的拼豆数量
- 💾 **导出功能** - 支持导出设计图和材料清单

## 技术栈

- **前端框架**: React 19.2.0
- **构建工具**: Vite 6.2.0
- **语言**: TypeScript
- **样式**: Tailwind CSS

## 项目结构

```
pixelbead/
├── components/          # React组件
│   ├── BeadGrid.tsx    # 拼豆网格显示组件
│   ├── Controls.tsx    # 控制面板组件
│   └── PaletteList.tsx # 调色板列表组件
├── services/           # 服务层
│   └── geminiService.ts # Google Gemini AI服务
├── utils/              # 工具函数
│   └── imageProcessor.ts # 图片处理工具
├── types.ts            # TypeScript类型定义
├── constants.ts        # 常量定义
├── App.tsx             # 主应用组件
└── index.tsx           # 应用入口点
```

## 安装与运行

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 使用说明

1. **上传图片**: 点击左侧上传区域，选择要转换的图片
2. **选择调色板**: 在右侧面板选择适合的拼豆调色板
3. **调整设置**: 在控制面板中调整拼豆图案的宽度和最大颜色数
4. **查看结果**: 主区域会显示转换后的拼豆图案
5. **导出设计**: 点击导出按钮保存设计图和材料清单

## 配置说明

### 调色板配置

调色板配置在`constants.ts`文件中，可以添加或修改调色板：

```typescript
export const PALETTES = {
  'palette-id': {
    name: '调色板名称',
    colors: [
      { id: 'color-id', name: '颜色名称', hex: '#RRGGBB', rgb: { r, g, b } },
      // 更多颜色...
    ]
  },
  // 更多调色板...
};
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

---

**像素拼豆工作室** - 让创意变成现实的拼豆设计工具 🎨